'use strict';

angular.module('webrtcTestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.game.connectingToHost', {
        url: '/connectingToHost/:host',
        templateUrl: 'app/controllers/game/connectingToHost/connectingToHost.html',
        controller: 'ConnectingToHostCtrl'
      });      
  
  });




  