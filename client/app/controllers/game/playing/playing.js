'use strict';

angular.module('webrtcTestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.game.playing', {
        url: '/playing',
        templateUrl: 'app/controllers/game/playing/playing.html',
        controller: 'PlayingCtrl'
      });
  
  });
