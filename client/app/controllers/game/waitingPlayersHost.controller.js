'use strict';

angular.module('webrtcTestApp')
  .controller('WaitingPlayersHostCtrl', function ($rootScope,$scope,$log,midiService,$http,$state) {

  	$scope.rootScope = $rootScope;

    $rootScope.$on("playmyband.webrtc.call.ringing",function(event){
    	$rootScope.telScaleWebRTCPhoneController.acceptCall();
      //let user check number of players
    	$scope.digest();
      //send session init message so player may prepare song
      var sessionInitMsg = {data: {localPlayerId:$rootScope.telScaleWebRTCPhoneController.webRTCommActiveCalls.length, songURL:$rootScope.songURL, difficultyLevel:$rootScope.difficultyLevel}};
      rootScope.telScaleWebRTCPhoneController.sendDataMessage("allContacts", JSON.stringify(sessionInitMsg));
    });

    $scope.startGame=function(){
      //send session init message so player may prepare song
      var startGameMsg = {data: "startGame"};
      rootScope.telScaleWebRTCPhoneController.sendDataMessage("allContacts", JSON.stringify(startGameMsg));      
      $state.go('main.playing');
    }
  });
