'use strict';

angular.module('webrtcTestApp')
  .controller('GameMainController', function ($rootScope,$scope,$log) {
    $scope.globalScore = 0;
    $log.info('Loading main game controller with user');

    $scope.user=null;

  });
