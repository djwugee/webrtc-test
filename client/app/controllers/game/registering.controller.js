'use strict';

angular.module('webrtcTestApp')
  .controller('RegisteringPlayerCtrl', function ($rootScope,$scope,$log,midiService,$http,$state) {

    $rootScope.$on("playmyband.webrtc.client.opened",function(event){
      $state.go('main.selectSong');

    });

    $rootScope.$on("playmyband.webrtc.client.openError",function(event){
      alert("conn failed");
    });    


    $scope.registerPlayer=function(userModel){
      $rootScope.telScaleWebRTCPhoneController = new TelScaleWebRTCPhoneController($rootScope);
      $rootScope.telScaleWebRTCPhoneController.register(userModel.name);
    }  

  });
