'use strict';

angular.module('webrtcTestApp')
  .service('$fxService', function ($rootScope) {
	this.playFXSound = function(soundId) {
        var audioUrl='/assets/fretsFX/' + soundId;
        if($rootScope.serverRuntime){
          audioUrl='/playmyband'+audioUrl;
        }
        var audioFX = new Audio(audioUrl);
        audioFX.play(); 
    };
    this.playStartGameFXSound = function() {
    	this.playFXSound('start.ogg');
    };

    this.playUserFailedNoteFXSound = function(playerId) {
    	this.playFXSound('fiba' + playerId + '.ogg');
    };    
  });
