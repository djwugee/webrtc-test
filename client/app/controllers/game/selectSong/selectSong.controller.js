'use strict';

angular.module('webrtcTestApp')
  .controller('SelectSongCtrl', function ($rootScope,$scope,$log,$http,$state,$midiService) {
    var waitingPlayersHostState= $rootScope.WAITING_PLAYERS_HOST_STATE;
    var errorState=$rootScope.ERROR_STATE;
    var selectSongState=$rootScope.SELECT_SONG_STATE;
    var connectingToHostState= $rootScope.CONNECTING_TO_HOST_STATE;


    $log.info('SelectSongCtrl - entering...');
    //number of seconds in advance the notes are rendered in canvas
    $rootScope.pMBsecondsInAdvance = 3;
    $rootScope.pMBlocalStream = null;

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
      },
      {
        label:'bangbang',
        src:'bangbang'
      }      

    ];
    $scope.selectedSong = $scope.songs[0].label;  

    $rootScope.$on('playmyband.webrtc.usermedia.sucess',function(event, stream) {
      $log.info('SelectSongCtrl - usermedia.success event',event);
      $rootScope.pMBlocalStream = URL.createObjectURL(stream);
    });    

    function downloadMidi()
    {
        $log.debug('SelectSongCtrl - downloading midi file');

        // do the get request with response type 'blobl' 
        $http.get($rootScope.pMBmidiURL,{responseType: 'blob'}).
          // success(function(data, status, headers, config) {
          success(function(data) {

            //create a file from arraybuffer
            var reader = new FileReader();
            reader.onload = function(event) {
              var contents = event.target.result; 
              $rootScope.pMBmidiFile = new $midiService.MidiFile(contents, $rootScope.pMBdifficultyLevel);
              $log.info('Midi loaded, going to state'+waitingPlayersHostState);
              $state.go(waitingPlayersHostState);              
            };

            
            reader.readAsBinaryString(data);


          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $log.debug('SelectSongCtrl - handling error getting midi',$rootScope.pMBsongURL,data,status,headers,config);

            $log.info('SelectSongCtrl - going to state '+errorState);
            $state.go(errorState);
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

    $rootScope.$on('playmyband.webrtc.iceservers.error',function(){
      $log.error('iceservers error');
      if ($state.is(selectSongState)) {
        $rootScope.pMBtelScaleWebRTCPhoneController.call($rootScope.pMBremotePlayerName);

        $log.info('SelectSongCtrl - going to state '+connectingToHostState);
        $state.go(connectingToHostState);
      }
    });     

    $rootScope.$on('playmyband.webrtc.iceservers.retrieved',function(){
      $log.error('iceservers OK');

      if ($state.is(selectSongState)) {      
        $log.info('SelectSongCtrl - going to state '+connectingToHostState);
        $state.go(connectingToHostState);
      }
    });

    $scope.joinGame=function(joinModel){
      $rootScope.pMBremotePlayerName = joinModel.contact;
      $rootScope.pMBtelScaleWebRTCPhoneController.retrieveIceServers(); 
      
    };

  });
