'use strict';

angular.module('webrtcTestApp')
  .controller('WaitingPlayersHostCtrl', function ($rootScope,$scope,$log,midiService,$http,$state) {

    $scope.startGame=function(){
      $state.go('main.playing');

    }
  });
