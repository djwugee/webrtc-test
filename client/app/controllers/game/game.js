'use strict';

angular.module('webrtcTestApp')
  .config(function ($stateProvider) {

    $stateProvider
      .state('main.game', {
        url: 'game',
        templateUrl: 'app/controllers/game/game.html',
        controller: 'GameMainController'
    });   
    /*
    $stateProvider
      .state('game.registeringPlayer', {
        url: 'game/registering/:playerName',
        templateUrl: 'app/controllers/game/registeringPlayer.html',
        controller: 'RegisteringPlayerCtrl'
      });   
    $stateProvider
      .state('main.selectSong', {
        url: 'game',
        templateUrl: 'app/controllers/game/selectSong.html',
        controller: 'SelectSongCtrl'
      });
    $stateProvider
      .state('main.waitingPlayersHost', {
        url: 'waitingPlayersHost',
        templateUrl: 'app/controllers/game/waitingPlayersHost.html',
        controller: 'WaitingPlayersHostCtrl'
      });
    $stateProvider
      .state('main.connectingToHost', {
        url: 'connectingToHost',
        templateUrl: 'app/controllers/game/connectingToHost.html',
        controller: 'ConnectingToHostCtrl'
      });      
    $stateProvider
      .state('main.waitingPlayers', {
        url: 'waitingPlayers',
        templateUrl: 'app/controllers/game/waitingPlayers.html',
        controller: 'WaitingPlayersCtrl'
      });


ESTE NO EXISTE????

    $stateProvider
      .state('main.startingGame', {
        url: 'startingGame',
        templateUrl: 'app/controllers/game/startingGame.html',
        controller: 'StartingGameCtrl'
      });     
    $stateProvider
      .state('main.playing', {
        url: 'playing',
        templateUrl: 'app/controllers/game/playing.html',
        controller: 'PlayingCtrl'
      });
*/
     /* 
    $stateProvider
      .state('main.error', {
        url: 'error',
        templateUrl: 'app/controllers/game/error.html',
        controller: 'ErrorCtrl'
      });      
*/
  });