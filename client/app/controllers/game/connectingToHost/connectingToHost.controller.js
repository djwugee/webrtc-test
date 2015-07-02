'use strict';

angular.module('webrtcTestApp')
  .controller('ConnectingToHostCtrl', function ($rootScope,$scope,$stateParams,$log,$http,$state,$midiService) {
    $log.info('ConnectingToHostCtrl - entering');

    //init call
    var host= $stateParams.host;
    $log.info('ConnectingToHostCtrl - calling host '+host);
    $rootScope.pMBtelScaleWebRTCPhoneController.call(host);


    $rootScope.$on('playmyband.webrtc.data.message.received',function(event, message){
      if ($state.is($rootScope.CONNECTING_TO_HOST_STATE)) {
        $log.debug('ConnectingToHostCtrl - start session message received', message);
        var msgContent = JSON.parse(message.content);
        $rootScope.$broadcast('playmyband.connected', msgContent);
      }
    });
            

    function downloadMidi()
    {
        $log.debug('ConnectingToHostCtrl - downloading midi file');

        // do the get request with response type 'blobl' 
        $http.get($rootScope.pMBmidiURL,{responseType: 'blob'}).
          // success(function(data, status, headers, config) {
          success(function(data) {
            // this callback will be called asynchronously
            // when the response is available
            $log.debug('ConnectingToHostCtrl - loading demo from $http OK');

            //create a file from arraybuffer
            var reader = new FileReader();
            reader.onload = function(event) {
              var contents = event.target.result; 
              $rootScope.pMBmidiFile = new $midiService.MidiFile(contents, $rootScope.pMBdifficultyLevel);
              $state.go($rootScope.WAITING_PLAYERS_STATE); 
            };

            
            reader.readAsBinaryString(data);


          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $log.debug('ConnectingToHostCtrl - loading demo from $http KO',$rootScope.pMBsongURL,data,status,headers,config);
          });      
    }



    $rootScope.$on('playmyband.connected',function(event, message){
      $log.debug('ConnectingToHostCtrl - connected to main game as player...',message);
      var localPlayerIndex = message.players.indexOf($rootScope.pMBlocalPlayerName);
      $rootScope.pMBlocalPlayerId=localPlayerIndex + 1;
      $rootScope.pMBplayers= message.players;
      $rootScope.pMBsongURL = message.songURL;
      $rootScope.pMBmidiURL = message.midiURL;
		  $rootScope.pMBdifficultyLevel = message.difficultyLevel;
      $rootScope.pMBnoteErrorMarginMS = message.noteErrorMarginMS;
      downloadMidi();
      //last player calls to previous player to close the Mesh network
      var previousPlayerIndex = localPlayerIndex - 1;
      //prevent second player to call first again.
      if (previousPlayerIndex > 0)
      {
        $rootScope.pMBtelScaleWebRTCPhoneController.call($rootScope.pMBplayers[previousPlayerIndex]);
      }
    });




  });
