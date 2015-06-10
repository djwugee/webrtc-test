'use strict';

angular.module('webrtcTestApp')
  .controller('DemoCtrl', function ($rootScope,$scope,$log,$midiService,$q,$state) {
    $log.debug('Loading demo controller');

    //loading demo info
    var localUrl='/assets/midi/PearlJamBetterMan/notes.mid';
    var serverUrl='/playmyband/assets/midi/PearlJamBetterMan/notes.mid';
    $rootScope.songUrl=localUrl;
    $rootScope.pMBdifficultyLevel = [96, 100];
    $rootScope.pMBplayers=[];
    $rootScope.pMBlocalPlayerId=2;

    $rootScope.pMBmidiFile=null;
    $scope.error=null;

    //load midi async
    function handleMidi(){
      var midiPromise= $midiService.downloadMidi($rootScope.songUrl,$rootScope.difficultyLevel);
      midiPromise.then(
        function(pMBmidiFile){
          //midi load OK
          $log.debug('DemoCtrl - Midi loaded');
          $rootScope.pMBmidiFile=pMBmidiFile;
          $scope.error=null;


        }, function(data,status){
          //midi load KO
          $log.debug('DemoCtrl - Error loading midi');

          if(status===404 &&  $scope.songUrl===localUrl){
            $log.debug('Trying with serverUrl');
            $rootScope.songUrl=serverUrl;
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
