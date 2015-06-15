'use strict';

angular.module('webrtcTestApp')
  .controller('DemoCtrl', function ($rootScope,$scope,$log,$midiService,$q,$state) {
    $log.debug('Loading demo controller');

    var serverRuntime=$rootScope.serverRuntime;

    //loading demo info
    var localMidiUrl='/assets/midi/PearlJamBetterMan/notes.mid';
    var serverMidiUrl='/playmyband/assets/midi/PearlJamBetterMan/notes.mid';

    var localSongUrl='/assets/midi/PearlJamBetterMan/guitar.ogg';
    var serverSongUrl='/playmyband/assets/midi/PearlJamBetterMan/guitar.ogg';

    //var localMidiUrl='/assets/midi/bangbang/notes.mid';
    //var serverMidiUrl='/playmyband/assets/midi/bangbang/notes.mid';

    //var localSongUrl='/assets/midi/bangbang/guitar.ogg';
    //var serverSongUrl='/playmyband/assets/midi/bangbang/guitar.ogg';



    $rootScope.pMBmidiURL = serverRuntime?serverMidiUrl:localMidiUrl;
    $rootScope.pMBsongURL = serverRuntime?serverSongUrl:localSongUrl;


    $rootScope.pMBdifficultyLevel = [96, 100];
    $rootScope.pMBplayers=[];
    $rootScope.pMBlocalPlayerId=1;
    $rootScope.pMBsecondsInAdvance = 6;

    $rootScope.pMBmidiFile=null;
    $scope.error=null;

    //load midi async
    function handleMidi(){
      var midiPromise= $midiService.downloadMidi($rootScope.pMBmidiURL,$rootScope.difficultyLevel);
      midiPromise.then(
        function(pMBmidiFile){
          //midi load OK
          $log.debug('DemoCtrl - Midi loaded');
          $rootScope.pMBmidiFile=pMBmidiFile;
          $scope.error=null;

          $state.go('main.playing');

        }, function(data,status){
          //midi load KO
          $log.debug('DemoCtrl - Error loading midi');

          if(status===404 &&  $scope.pMBmidiURL===localMidiUrl){
            $log.debug('Trying with serverUrl');
            $rootScope.pMBmidiURL=serverMidiUrl;
            handleMidi();

          }

          $rootScope.pMBmidiFile=null;
          $scope.error='Error loading midi file, response data: '+data;
          $scope.errorData=data;


      });
    }
    handleMidi();


    $scope.continue=function(){
      $state.go('main.playing');
    };

  });
