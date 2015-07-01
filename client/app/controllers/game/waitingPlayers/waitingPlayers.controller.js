'use strict';

angular.module('webrtcTestApp')
  .controller('WaitingPlayersCtrl', function ($rootScope,$scope,$log,$http,$state) {

    $rootScope.$on('playmyband.webrtc.call.ringing',function(event, webRTCommCall) {
      $log.info('WaitingPlayersCtrl - Call received, mesh closed', event, webRTCommCall);
      //allow to establish the Mesh network
      $rootScope.pMBtelScaleWebRTCPhoneController.acceptCall();
    });

    $rootScope.$on('playmyband.webrtc.data.message.received',function(event, message){
      if ($state.is($rootScope.WAITING_PLAYERS_STATE)) {
        $log.info('WaitingPlayersCtrl - message received', message);
        var msgContent = JSON.parse(message.content);
        if (msgContent.eventType && msgContent.eventType === 'startGame')
        {
          $log.debug('WaitingPlayersCtrl - start game message received');
          $state.go($rootScope.PLAYING_STATE);
        } else {
          $log.debug('WaitingPlayersCtrl - another party joined');
          $rootScope.pMBplayers= message.players;
          $scope.$digest();
        }
      }        
    });

  });
