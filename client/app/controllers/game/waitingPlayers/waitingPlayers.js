'use strict';

angular.module('webrtcTestApp')
  .config(function ($stateProvider) {
   $stateProvider
      .state('main.game.waitingPlayers', {
        url: '/waitingPlayers',
        templateUrl: 'app/controllers/game/waitingPlayers/waitingPlayers.html',
        controller: 'WaitingPlayersCtrl'
    });
  
  });




  