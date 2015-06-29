'use strict';

angular.module('webrtcTestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.game.login.facebook', {
        url: '/facebook',
        templateUrl: 'app/controllers/game/login/facebook/facebook.html',
        controller: 'FacebookCtrl'
      });
  });