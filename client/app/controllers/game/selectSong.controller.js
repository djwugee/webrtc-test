'use strict';

angular.module('webrtcTestApp')
  .controller('SelectSongCtrl', function ($rootScope,$scope,$log,$http,$state,$midiService) {
    //number of seconds in advance the notes are rendered in canvas
    $rootScope.secondsInAdvance = 10;

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

    function playMidi()
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
            $log.debug('loading demo from $http KO',data,status,headers,config);
          });      
    }

    //$scope.selectSong=function(selectSongModel){ NOT USED
    $scope.selectSong=function(){
      //first user, this is related to instrument in song, but hardcoded now.
      $rootScope.localPlayerId=1;
      //this should come from the user selection, hardcoded now for testing

      //$rootScope.songURL = '/playmyband/assets/midi/PearlJamBetterMan/notes.mid';
      $rootScope.songUrl=$scope.songs[0].src;
      
      //again hardcoded but sohuld be from user selected
      $rootScope.difficultyLevel = [96, 100];
      playMidi();
      $state.go('main.waitingPlayersHost');

    };



    $scope.joinGame=function(joinModel){
      $rootScope.telScaleWebRTCPhoneController.call(joinModel.contact);
      $state.go('main.connectingToHost');      
    };

  });
