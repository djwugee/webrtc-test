'use strict';

angular.module('webrtcTestApp')
  .controller('WaitingPlayersCtrl', function ($rootScope,$scope,$log,$http,$state) {


      $rootScope.$on('playmyband.webrtc.data.message.received',function(event, message){
        if ($state.is('main.waitingPlayers')) {
          $log.debug('message received', message);
          var msgContent = JSON.parse(message.content);
          if (msgContent.eventType && msgContent.eventType === 'startGame')
          {
            $log.debug('start game message received');
            $state.go('main.playing');
          } else {
            $log.debug('another party joined');
            $rootScope.$pMBplayers= message.players;
            $scope.$digest();
          }
        }        
      });

      $rootScope.$on('playmyband.webrtc.message.received',function(event, message){
        if ($state.is('main.waitingPlayers')) {
          $log.debug('message received', message);
          var msgContent = JSON.parse(message.text);
          if (msgContent.eventType && msgContent.eventType === 'startGame')
          {
            $log.debug('start game message received');
            $state.go('main.playing');
          } else {
            $log.debug('another party joined');
            $rootScope.$pMBplayers= message.players;
            $scope.$digest();
          }
        }
      });

  });
