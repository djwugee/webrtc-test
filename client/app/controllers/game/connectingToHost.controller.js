'use strict';

angular.module('webrtcTestApp')
  .controller('ConnectingToHostCtrl', function ($rootScope,$scope,$log,$http,$state,$midiService) {


      $rootScope.$on('playmyband.webrtc.message.received',function(event, message){
        $log.debug('start session message received', message);
        var msgContent = JSON.parse(message.text);
        $rootScope.$broadcast("playmyband.connected", msgContent);
      });             

    function downloadMidi()
    {
        $log.debug('downloading midi file');

        // do the get request with response type 'blobl' 
        $http.get($rootScope.songURL,{responseType: 'blob'}).
          // success(function(data, status, headers, config) {
          success(function(data) {
            // this callback will be called asynchronously
            // when the response is available
            $log.debug('loading demo from $http OK');
            $log.debug('data type: '+typeof data);
            $log.debug('data.byteLength '+data.byteLength);

            //create a file from arraybuffer
            var reader = new FileReader();
            reader.onload = function(event) {
              var contents = event.target.result; 
              $rootScope.midiFile = new $midiService.MidiFile(contents, $rootScope.difficultyLevel);
            };

            
            reader.readAsBinaryString(data);


          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $log.debug('loading demo from $http KO',$rootScope.songURL,data,status,headers,config);
          });      
    }



      $rootScope.$on('playmyband.connected',function(event, message){
        $log.debug('connected to main game as player...',message);
        $rootScope.localPlayerId=message.playerId;
        $rootScope.songURL = message.songURL;
  		  $rootScope.difficultyLevel = message.difficultyLevel;
        downloadMidi();
        $state.go('main.waitingPlayers');
      });

  });
