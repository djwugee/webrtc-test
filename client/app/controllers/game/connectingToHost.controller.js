'use strict';

angular.module('webrtcTestApp')
  .controller('ConnectingToHostCtrl', function ($rootScope,$scope,$log,$http,$state) {

      $rootScope.$on('playmyband.webrtc.call.opened',function(event){
        $log.debug('connected to main game, wait for start session message', event);
      });

      $rootScope.$on('playmyband.webrtc.data.message.received',function(event, message){
        $log.debug('start session message received');
        var msgContent = JSON.parse(message.getContent());
        $rootScope.broadcast('playmyband.connected', msgContent);
      });      



      $rootScope.$on('playmyband.connected',function(event){
        $log.debug('connected to main game as player...',event);
        $rootScope.localPlayerId=event.data.playerId;
        $rootScope.songURL = event.data.songURL;
  		  $rootScope.difficultyLevel = event.data.difficultyLevel;
        $state.go('main.waitingPlayers');
      });

  });
