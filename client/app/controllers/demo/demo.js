'use strict';

angular.module('webrtcTestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.demo', {
        url: 'demo',
        templateUrl: 'app/controllers/demo/demo.html',
        controller: 'DemoCtrl'
      });
  });