'use strict';

angular.module('webrtcTestApp')
  .controller('DemoCtrl', function ($rootScope,$scope,$log,$midiService,$q,$state) {
    $log.debug('Loading demo controller');

    //loading demo info
    $rootScope.songUrl='/assets/midi/PearlJamBetterMan/notes.mid';
    $rootScope.pMBdifficultyLevel = [96, 100];
    $rootScope.pMBplayers=[];
    $rootScope.pMBlocalPlayerId=2;

    $rootScope.pMBmidiFile=null;
    $scope.error=null;

    //load midi async
    var midiPromise= $midiService.downloadMidi($rootScope.songUrl,$rootScope.difficultyLevel);

    midiPromise.then(
      function(pMBmidiFile){
        //midi load OK
        $log.debug('DemoCtrl - Midi loaded');
        $rootScope.pMBmidiFile=pMBmidiFile;
        $scope.error=null;


      }, function(data){
        //midi load KO
        $log.debug('DemoCtrl - Error loading midi');
        $rootScope.pMBmidiFile=null;
        $scope.error='Error loading midi file, response data: '+data;
        $scope.errorData=data;


    });

    $scope.continue=function(){
      $state.go('main.playing');
    };

  });
