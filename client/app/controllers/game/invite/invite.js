'use strict';

angular.module('webrtcTestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.game.invite', {
        url: '/invite/:host',
        templateUrl: 'app/controllers/game/invite/invite.html',
        controller: 'InviteCtrl'
      });
  });