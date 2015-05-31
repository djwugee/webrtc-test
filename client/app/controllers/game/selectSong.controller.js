'use strict';

angular.module('webrtcTestApp')
  .controller('SelectSongCtrl', function ($rootScope,$scope,$log,midiService,$http,$state) {


    $scope.selectSong=function(){
      //first user, this is related to instrument in song, but hardcoded now.
      $rootScope.localPlayerId=1;
      //this should come from the user selection, hardcoded now for testing
      $rootScope.songURL = '/assets/midi/PearlJamBetterMan/notes.mid';
      //again hardcoded but sohuld be from user selected
      $rootScope.difficultyLevel = [96, 100];
      $state.go('main.waitingPlayersHost');

    }

    $scope.joinGame=function(){
      $state.go('main.connectingToHost');      
    }    

  });
