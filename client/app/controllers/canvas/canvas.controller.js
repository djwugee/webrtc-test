'use strict';

angular.module('webrtcTestApp')
  .controller('CanvasCtrl', function ($scope,$log) {
    $scope.message = 'Hello';
    $log.info('Loading canvas controller');
  });
