'use strict';

angular.module('webrtcTestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.canvas', {
        url: 'game',
        templateUrl: 'app/controllers/canvas/canvas.html',
        controller: 'CanvasCtrl'
      });
  });