'use strict';

angular.module('webrtcTestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('invite', {
        url: '/invite',
        templateUrl: 'app/controllers/game/invite/invite.html',
        controller: 'InviteCtrl'
      });
  });