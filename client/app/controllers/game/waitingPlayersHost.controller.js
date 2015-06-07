'use strict';

angular.module('webrtcTestApp')
  .controller('WaitingPlayersHostCtrl', function ($rootScope,$scope,$log,$http,$state) {

  	$scope.rootScope = $rootScope;

    $rootScope.$on('playmyband.webrtc.message.received',function(event, message){
      $log.debug('Received joinMsg:', message);
      var joinMsg = JSON.parse(message.text);
      alert("new player joined:" + joinMsg.playerId);
      $rootScope.remotePlayerName = joinMsg.playerId;
      //send session init message so player may prepare song
      var sessionInitMsg = {localPlayerId:2, songURL:$rootScope.songURL, difficultyLevel:$rootScope.difficultyLevel};
      $log.debug('Sending sessionInitMsg:' + sessionInitMsg);
      $rootScope.telScaleWebRTCPhoneController.sendOfflineMessage(joinMsg.playerId, JSON.stringify(sessionInitMsg));
    });  

    $scope.startGame=function(){
      var startGameMsg = {data: 'startGame'};
      $log.debug('Sending starGamemsg', startGameMsg);
      $rootScope.telScaleWebRTCPhoneController.sendOfflineMessage($rootScope.remotePlayerName, JSON.stringify(startGameMsg));      
      $state.go('main.playing');
    };
  });
