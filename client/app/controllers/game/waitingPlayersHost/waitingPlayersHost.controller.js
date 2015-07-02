'use strict';

angular.module('webrtcTestApp')
  .controller('WaitingPlayersHostCtrl', function ($rootScope,$scope,$log,$http,$state) {


    $rootScope.$on('playmyband.webrtc.iceservers.error',function(){
      if ($state.is($rootScope.WAITING_PLAYERS_HOST_STATE)) {
        $rootScope.pMBtelScaleWebRTCPhoneController.acceptCall();
      }
    });     

    $rootScope.$on('playmyband.webrtc.iceservers.retrieved',function(){
      if ($state.is($rootScope.WAITING_PLAYERS_HOST_STATE)) {      
        $rootScope.pMBtelScaleWebRTCPhoneController.acceptCall();
      }
    });
    
    $rootScope.$on('playmyband.webrtc.call.ringing',function(event, webRTCommCall) {
      $rootScope.pMBplayers.push(webRTCommCall.getCallerPhoneNumber());
      $scope.$digest();
      $rootScope.pMBtelScaleWebRTCPhoneController.retrieveIceServers();
    });

    $rootScope.$on('playmyband.webrtc.datachannel.open',function() {
        var sessionInitMsg = {players:$rootScope.pMBplayers, 
          songURL:$rootScope.pMBsongURL, 
          midiURL:$rootScope.pMBmidiURL, 
          difficultyLevel:$rootScope.pMBdifficultyLevel,
          noteErrorMarginMS:$rootScope.pMBnoteErrorMarginMS};
        $log.debug('WaitingPlayersHostCtrl - Sending sessionInitMsg:' + sessionInitMsg);
        $rootScope.pMBtelScaleWebRTCPhoneController.sendDataMessage('allContacts', JSON.stringify(sessionInitMsg));
    });    

    

    $rootScope.$on('playmyband.webrtc.call.opened',function(event, webRTCommCall) {
      $log.info('WaitingPlayersHostCtrl - Call established:', event,webRTCommCall);
      
      /*setTimeout(function(){
        var sessionInitMsg = {players:$rootScope.pMBplayers, 
          songURL:$rootScope.pMBsongURL, 
          midiURL:$rootScope.pMBmidiURL, 
          difficultyLevel:$rootScope.pMBdifficultyLevel,
          noteErrorMarginMS:$rootScope.pMBnoteErrorMarginMS};
        $log.debug('Sending sessionInitMsg:' + sessionInitMsg);
        $rootScope.pMBtelScaleWebRTCPhoneController.sendDataMessage('allContacts', JSON.stringify(sessionInitMsg));
      },5000); */      

    }); 

    $scope.startGame=function(){
      var startGameMsg = {eventType: 'startGame'};
      $log.debug('WaitingPlayersHostCtrl - Sending starGamemsg', startGameMsg);
      $rootScope.pMBtelScaleWebRTCPhoneController.sendDataMessage('allContacts', JSON.stringify(startGameMsg));
      /*
      $rootScope.pMBplayers.forEach(function(entry) {
        $rootScope.pMBtelScaleWebRTCPhoneController.sendOfflineMessage(entry, JSON.stringify(startGameMsg));      
      });*/
      $state.go($rootScope.PLAYING_STATE);
    };
  });
