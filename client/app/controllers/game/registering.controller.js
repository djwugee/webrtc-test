'use strict';

angular.module('webrtcTestApp')
  .controller('RegisteringPlayerCtrl', function ($rootScope,$scope,$log,$midiService,$http,$state,$window,$webRtcService) {

    $rootScope.$on('playmyband.webrtc.client.opened',function(){
      $state.go('main.selectSong');
      try
      {
        if ($rootScope.pMBtelScaleWebRTCPhoneController.audio || $rootScope.pMBtelScaleWebRTCPhoneController.video)
        {
          this.getLocalUserMedia($rootScope.pMBtelScaleWebRTCPhoneController.DEFAULT_LOCAL_VIDEO_FORMAT);
        }
      }
      catch(exception)
      {
          console.error('TelScaleWebRTCPhoneController:onWebRTCommClientOpenedEvent(): catched exception: '+exception);
          console.error('TelScaleWebRTCPhoneController:onWebRTCommClientOpenedEvent(): catched exception: '+exception);
      }       
    });

    $rootScope.$on('playmyband.webrtc.client.openError',function(){
      $window.alert('conn failed');
    });    

    
    $rootScope.pMBplayers= [];      
    $rootScope.pMBtelScaleWebRTCPhoneController = new $webRtcService.TelScaleWebRTCPhoneController();

    $scope.registerPlayer=function(userModel){
      $rootScope.pMBlocalPlayerName=userModel.name;
      $rootScope.pMBtelScaleWebRTCPhoneController.register(userModel.name);
    } ; 

  });
