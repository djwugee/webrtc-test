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

    $rootScope.$on('playmyband.webrtc.iceservers.retrieved',function(){
      $rootScope.pMBtelScaleWebRTCPhoneController.register($rootScope.pMBlocalPlayerName);
    });

    $rootScope.$on('playmyband.webrtc.iceservers.error',function(){
      //try with default conf anyway, myabe STUN works
      $rootScope.pMBtelScaleWebRTCPhoneController.register($rootScope.pMBlocalPlayerName);
    }); 
    

    $rootScope.$on('playmyband.webrtc.client.openError',function(){
      $state.go('main.error');
    });    

    
    $rootScope.pMBplayers= [];      
    $rootScope.pMBtelScaleWebRTCPhoneController = new $webRtcService.TelScaleWebRTCPhoneController();

    $scope.registerPlayer=function(userModel){
      $rootScope.pMBlocalPlayerName=userModel.name;
      $rootScope.pMBtelScaleWebRTCPhoneController.retrieveIceServers();      
    } ; 

  });
