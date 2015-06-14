'use strict';

angular.module('webrtcTestApp')
  .controller('SelectSongCtrl', function ($rootScope,$scope,$log,$http,$state,$midiService) {
    //number of seconds in advance the notes are rendered in canvas
    $rootScope.pMBsecondsInAdvance = 5;

    $scope.songs=[
      {
        label:'PearlJamBetterMan',
        src:'PearlJamBetterMan'
      },
      {
        label:'NeverAgainNickelback',
        src:'NeverAgainNickelback'
      },
      {
        label:'DisturbedTheSicknes',
        src:'DisturbedTheSicknes'
      }      
    ];
    $scope.selectedSong = $scope.songs[0].label;

    
    $rootScope.$on('playmyband.webrtc.usermedia.sucess',function(event, stream) {
      $rootScope.pMBlocalStream = URL.createObjectURL(stream);
    });    

    function downloadMidi()
    {
        $log.debug('downloading midi file');

        // do the get request with response type 'blobl' 
        $http.get($rootScope.pMBmidiURL,{responseType: 'blob'}).
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
      $rootScope.pMBlocalPlayerId = 1;
      $rootScope.pMBplayers.push($rootScope.pMBlocalPlayerName);  
      //this should come from the user selection, hardcoded now for testing

      $rootScope.pMBsongURL = '/playmyband/assets/midi/' + $scope.selectedSong + '/guitar.ogg';
      $rootScope.pMBmidiURL = '/playmyband/assets/midi/' + $scope.selectedSong + '/notes.mid';
      $rootScope.pMBnoteErrorMarginMS = 300;

      //again hardcoded but sohuld be from user selected
      $rootScope.pMBdifficultyLevel = [96, 100];
      downloadMidi();
      

    };



    $scope.joinGame=function(joinModel){

      $rootScope.pMBremotePlayerName = joinModel.contact;
      $rootScope.pMBtelScaleWebRTCPhoneController.call($rootScope.pMBremotePlayerName);
      $state.go('main.connectingToHost');      
    };

  });
