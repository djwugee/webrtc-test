'use strict';

angular.module('webrtcTestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.error', {
        url: 'error',
        templateUrl: 'app/controllers/error/error.html',
        controller: 'ErrorCtrl'
      });      
  
  });
