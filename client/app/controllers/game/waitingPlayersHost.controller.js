'use strict';

angular.module('webrtcTestApp')
  .controller('WaitingPlayersHostCtrl', function ($rootScope,$scope,$log,$http,$state) {

    
    $rootScope.$on('playmyband.webrtc.call.ringing',function(event, webRTCommCall) {
      $rootScope.pMBtelScaleWebRTCPhoneController.acceptCall();
      $rootScope.pMBplayers.push(webRTCommCall.getCallerPhoneNumber());
      $scope.$digest();
    });

    $rootScope.$on('playmyband.webrtc.call.opened',function(event, webRTCommCall) {
      $log.debug('Call established:', event,webRTCommCall);
      
      setTimeout(function(){
        var sessionInitMsg = {players:$rootScope.pMBplayers, 
          songURL:$rootScope.pMBsongURL, 
          midiURL:$rootScope.pMBmidiURL, 
          difficultyLevel:$rootScope.pMBdifficultyLevel,
          noteErrorMarginMS:$rootScope.pMBnoteErrorMarginMS};
        $log.debug('Sending sessionInitMsg:' + sessionInitMsg);
        $rootScope.pMBtelScaleWebRTCPhoneController.sendDataMessage('allContacts', JSON.stringify(sessionInitMsg));
      },5000);       

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
