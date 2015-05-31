'use strict';

angular.module('webrtcTestApp')
  .controller('WaitingPlayersCtrl', function ($rootScope,$scope,$log,midiService,$http,$state) {
          $rootScope.$on("playmyband.gameStarted",function(event){
            $log.debug('game started...',event);
            $state.go('main.playing');
          });
  });
