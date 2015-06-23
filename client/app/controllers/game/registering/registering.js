'use strict';

angular.module('webrtcTestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.game.registeringPlayer', {
        url: '/registering/:userName',
        templateUrl: 'app/controllers/game/registering/registeringPlayer.html',
        controller: 'RegisteringPlayerCtrl'
      });   
  
  });