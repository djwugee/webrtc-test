'use strict';

angular.module('webrtcTestApp')
  .controller('ConnectingToHostCtrl', function ($rootScope,$scope,$log,midiService,$http,$state) {

          $rootScope.$on("playmyband.connected",function(event){
            $log.debug('connected to main game as player...',event);
            $rootScope.localPlayerId=event.data.playerId;
            $rootScope.songURL = event.data.songURL;
      		$rootScope.difficultyLevel = event.data.difficultyLevel;
            $state.go('main.waitingPlayers');
          });

  });
