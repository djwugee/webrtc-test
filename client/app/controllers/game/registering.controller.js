'use strict';

angular.module('webrtcTestApp')
  .controller('RegisteringPlayerCtrl', function ($rootScope,$scope,$log,$midiService,$http,$state,$window,$webRtcService) {

    $rootScope.$on('playmyband.webrtc.client.opened',function(){
      $state.go('main.selectSong');

    });

    $rootScope.$on('playmyband.webrtc.client.openError',function(){
      $window.alert('conn failed');
    });    


    $scope.registerPlayer=function(userModel){
      $rootScope.localPlayerName=userModel.name;      
      $rootScope.telScaleWebRTCPhoneController = new $webRtcService.TelScaleWebRTCPhoneController();
      $rootScope.telScaleWebRTCPhoneController.register(userModel.name);
    } ; 

  });
