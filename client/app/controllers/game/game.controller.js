'use strict';

angular.module('webrtcTestApp')
  .controller('GameMainController', function ($rootScope,$scope,$log,$webRtcService) {
    $scope.globalScore = 0;
    $log.info('Loading main game controller with user');

    //init user
    $scope.user={
      name:null
    };

    $rootScope.pMBplayers= [];      
    $rootScope.pMBtelScaleWebRTCPhoneController = new $webRtcService.TelScaleWebRTCPhoneController();


  });
