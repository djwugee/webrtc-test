'use strict';

angular.module('webrtcTestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.game.registeringPlayer', {
        url: 'registering',
        templateUrl: 'app/controllers/game/registeringPlayer.html',
        controller: 'RegisteringPlayerCtrl'
      });   
  
  });