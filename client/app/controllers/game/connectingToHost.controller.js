'use strict';

angular.module('webrtcTestApp')
  .controller('ConnectingToHostCtrl', function ($rootScope,$scope,$log,$http,$state,$midiService) {


      $rootScope.$on('playmyband.webrtc.message.received',function(event, message){
        if ($state.is('main.connectingToHost')) {
          $log.debug('start session message received', message);
          var msgContent = JSON.parse(message.text);
          $rootScope.$broadcast('playmyband.connected', msgContent);
        }
      });             

    function downloadMidi()
    {
        $log.debug('downloading midi file');

        // do the get request with response type 'blobl' 
        $http.get($rootScope.pMBsongURL,{responseType: 'blob'}).
          // success(function(data, status, headers, config) {
          success(function(data) {
            // this callback will be called asynchronously
            // when the response is available
            $log.debug('loading demo from $http OK');

            //create a file from arraybuffer
            var reader = new FileReader();
            reader.onload = function(event) {
              var contents = event.target.result; 
              $rootScope.pMBmidiFile = new $midiService.MidiFile(contents, $rootScope.pMBdifficultyLevel);
              $state.go('main.waitingPlayers'); 
            };

            
            reader.readAsBinaryString(data);


          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $log.debug('loading demo from $http KO',$rootScope.pMBsongURL,data,status,headers,config);
          });      
    }



      $rootScope.$on('playmyband.connected',function(event, message){
        $log.debug('connected to main game as player...',message);
        $rootScope.pMBlocalPlayerId=message.players.indexOf($rootScope.pMBlocalPlayerName) + 1;
        $rootScope.pMBplayers= message.players;
        $rootScope.pMBsongURL = message.songURL;
  		  $rootScope.pMBdifficultyLevel = message.difficultyLevel;
        downloadMidi();      
      });

  });
