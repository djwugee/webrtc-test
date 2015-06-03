'use strict';

angular.module('webrtcTestApp')
  .controller('WaitingPlayersCtrl', function ($rootScope,$scope,$log,midiService,$http,$state) {

  	$rootScope.$on("playmyband.webrtc.data.message.received",function(event, message){
        $log.debug('start game message received');
        $rootScope.broadcast("playmyband.gameStarted");
      });  
    
	  $rootScope.$on("playmyband.gameStarted",function(event){
	    $log.debug('game started...',event);
	    $state.go('main.playing');
	  });
  });
