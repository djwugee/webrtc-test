'use strict';

angular.module('webrtcTestApp')
  .controller('WaitingPlayersHostCtrl', function ($rootScope,$scope,$log,$http,$state) {

    $rootScope.$on('playmyband.webrtc.message.received',function(event, message){
      $log.debug('Received joinMsg:', message);
      var joinMsg = JSON.parse(message.text);
      $scope.$parent.remotePlayerName = joinMsg.playerId;
      $scope.$digest();
      //send session init message so player may prepare song
      var sessionInitMsg = {playerId:2, songURL:$scope.$parent.songURL, difficultyLevel:$scope.$parent.difficultyLevel};
      $log.debug('Sending sessionInitMsg:' + sessionInitMsg);
      $scope.$parent.telScaleWebRTCPhoneController.sendOfflineMessage(joinMsg.playerId, JSON.stringify(sessionInitMsg));
    });  

    $scope.startGame=function(){
      var startGameMsg = {data: 'startGame'};
      $log.debug('Sending starGamemsg', startGameMsg);
      $scope.$parent.telScaleWebRTCPhoneController.sendOfflineMessage($scope.$parent.remotePlayerName, JSON.stringify(startGameMsg));      
      $state.go('main.playing');
    };
  });
