'use strict';

angular.module('webrtcTestApp')
  .controller('SelectSongCtrl', function ($rootScope,$scope,$log,$http,$state,$midiService) {
    //number of seconds in advance the notes are rendered in canvas
    $rootScope.pMBsecondsInAdvance = 10;

    $scope.songs=[
      {
        label:'playmyband-PearlJamBetterMan',
        src:'/playmyband/assets/midi/PearlJamBetterMan/notes.mid'
      },
      {
        label:'PearlJamBetterMan',
        src:'/assets/midi/PearlJamBetterMan/notes.mid'
      }
    ];

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
            $log.debug('data type: '+typeof data);
            $log.debug('data.byteLength '+data.byteLength);

            //create a file from arraybuffer
            var reader = new FileReader();
            reader.onload = function(event) {
              var contents = event.target.result; 
              $rootScope.pMBmidiFile = new $midiService.MidiFile(contents, $rootScope.pMBdifficultyLevel);
              $state.go('main.waitingPlayersHost');              
            };

            
            reader.readAsBinaryString(data);


          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $log.debug('loading demo from $http KO',$rootScope.pMBsongURL,data,status,headers,config);
          });      
    }

    //$scope.selectSong=function(selectSongModel){ NOT USED
    $scope.selectSong=function(){
      //im host,so im the first player, position relates to instrument and canvas
      $scope.localPlayerId = 0;
      $rootScope.pMBplayers.push($rootScope.pMBlocalPlayerName);  
      //this should come from the user selection, hardcoded now for testing

      $rootScope.pMBsongURL = '/playmyband/assets/midi/PearlJamBetterMan/notes.mid';
      //$rootScope.songUrl=$scope.songs[0].src;

      //again hardcoded but sohuld be from user selected
      $rootScope.pMBdifficultyLevel = [96, 100];
      downloadMidi();
      

    };



    $scope.joinGame=function(joinModel){

      $rootScope.pMBremotePlayerName = joinModel.contact;

      var joinMsg = {playerId: $rootScope.pMBlocalPlayerName};
      $log.debug('Sending joinMsg', joinMsg);
      $rootScope.pMBtelScaleWebRTCPhoneController.sendOfflineMessage(joinModel.contact, JSON.stringify(joinMsg));
      $state.go('main.connectingToHost');      
    };

  });
