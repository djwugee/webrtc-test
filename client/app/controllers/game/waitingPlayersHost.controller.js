'use strict';

angular.module('webrtcTestApp')
  .controller('WaitingPlayersHostCtrl', function ($rootScope,$scope,$log,$http,$state) {

    $rootScope.$on('playmyband.webrtc.message.received',function(event, message){
      if ($state.is('main.waitingPlayersHost')) {
      $log.debug('Received joinMsg:', message);
      var joinMsg = JSON.parse(message.text);
      $rootScope.pMBplayers.push(joinMsg.playerId);
      $scope.$digest();
      //send session init message so player may prepare song, send every time one player joins
      $rootScope.pMBplayers.forEach(function(entry) {
          var sessionInitMsg = {players:$rootScope.pMBplayers, songURL:$rootScope.pMBsongURL, difficultyLevel:$rootScope.pMBdifficultyLevel};
          $log.debug('Sending sessionInitMsg:' + sessionInitMsg);
          $rootScope.pMBtelScaleWebRTCPhoneController.sendOfflineMessage(entry, JSON.stringify(sessionInitMsg));
      });     
      } 
    });  

    $scope.startGame=function(){
      var startGameMsg = {eventType: 'startGame'};
      $log.debug('Sending starGamemsg', startGameMsg);
      $rootScope.pMBplayers.forEach(function(entry) {
        $rootScope.pMBtelScaleWebRTCPhoneController.sendOfflineMessage(entry, JSON.stringify(startGameMsg));      
      });
      $state.go('main.playing');
    };
  });
