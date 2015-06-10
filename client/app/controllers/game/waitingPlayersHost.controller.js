'use strict';

angular.module('webrtcTestApp')
  .controller('WaitingPlayersHostCtrl', function ($rootScope,$scope,$log,$http,$state) {

    
    $rootScope.$on('playmyband.webrtc.call.ringing',function(event, webRTCommCall) {
      $rootScope.pMBtelScaleWebRTCPhoneController.acceptCall();
      $rootScope.pMBplayers.push(webRTCommCall.getCallerPhoneNumber());
    });

    $rootScope.$on('playmyband.webrtc.call.opened',function(event, webRTCommCall) {
      $log.debug('Call established:', event,webRTCommCall);
      
      setTimeout(function(){
        var sessionInitMsg = {players:$rootScope.pMBplayers, songURL:$rootScope.pMBsongURL, difficultyLevel:$rootScope.pMBdifficultyLevel};
        $log.debug('Sending sessionInitMsg:' + sessionInitMsg);
        $rootScope.pMBtelScaleWebRTCPhoneController.sendDataMessage('allContacts', JSON.stringify(sessionInitMsg));
      },5000);       

    });    


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
      $rootScope.pMBtelScaleWebRTCPhoneController.sendDataMessage('allContacts', JSON.stringify(startGameMsg));
      /*
      $rootScope.pMBplayers.forEach(function(entry) {
        $rootScope.pMBtelScaleWebRTCPhoneController.sendOfflineMessage(entry, JSON.stringify(startGameMsg));      
      });*/
      $state.go('main.playing');
    };
  });
