'use strict';

angular.module('webrtcTestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.game.login', {
        url: '/login',
        templateUrl: 'app/controllers/game/login/login.html',
        controller: 'LoginCtrl'
      });
  });