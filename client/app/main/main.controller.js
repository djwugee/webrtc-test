'use strict';

angular.module('webrtcTestApp')
  .controller('MainCtrl', function ($rootScope) {
    
    //register global states
    $rootScope.LOGIN_STATE='main.game.login';
    $rootScope.REGISTERING_STATE='main.game.registeringPlayer';
    $rootScope.SELECT_SONG_STATE='main.game.selectSong';
    $rootScope.WAITING_PLAYERS_HOST_STATE='main.game.waitingPlayersHost';
    $rootScope.WAITING_PLAYERS_STATE='main.game.waitingPlayers';
    $rootScope.CONNECTING_TO_HOST_STATE='main.game.connectingToHost';

    $rootScope.PLAYING_STATE='main.game.playing';

    $rootScope.ERROR_STATE='main.error';

  });


