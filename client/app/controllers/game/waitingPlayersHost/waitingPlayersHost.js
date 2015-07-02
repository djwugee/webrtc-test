'use strict';

angular.module('webrtcTestApp')
  .config(function ($stateProvider) {
   $stateProvider
      .state('main.game.waitingPlayersHost', {
        url: '/waitingPlayersHost',
        templateUrl: 'app/controllers/game/waitingPlayersHost/waitingPlayersHost.html',
        controller: 'WaitingPlayersHostCtrl'
    });
  
  });




  