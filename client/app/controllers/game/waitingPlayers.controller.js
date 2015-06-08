'use strict';

angular.module('webrtcTestApp')
  .controller('WaitingPlayersCtrl', function ($rootScope,$scope,$log,$http,$state) {

  	$rootScope.$on('playmyband.webrtc.message.received',function(event, message){
        $log.debug('start game message received');
        $rootScope.$broadcast('playmyband.gameStarted', JSON.parse(message.text));
      });  
    
	  $rootScope.$on('playmyband.gameStarted',function(event, message){
	    $log.debug('game started...',message);
	    $state.go('main.playing');
	  });
  });
