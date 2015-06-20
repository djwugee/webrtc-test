'use strict';

angular.module('webrtcTestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.registeringPlayer', {
        url: 'game',
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
        url: 'game',
        templateUrl: 'app/controllers/game/waitingPlayersHost.html',
        controller: 'WaitingPlayersHostCtrl'
      });
    $stateProvider
      .state('main.connectingToHost', {
        url: 'game',
        templateUrl: 'app/controllers/game/connectingToHost.html',
        controller: 'ConnectingToHostCtrl'
      });      
    $stateProvider
      .state('main.waitingPlayers', {
        url: 'game',
        templateUrl: 'app/controllers/game/waitingPlayers.html',
        controller: 'WaitingPlayersCtrl'
      });
    $stateProvider
      .state('main.startingGame', {
        url: 'game',
        templateUrl: 'app/controllers/game/startingGame.html',
        controller: 'StartingGameCtrl'
      });     
    $stateProvider
      .state('main.playing', {
        url: 'game',
        templateUrl: 'app/controllers/game/playing.html',
        controller: 'PlayingCtrl'
      });
    $stateProvider
      .state('main.error', {
        url: 'game',
        templateUrl: 'app/controllers/game/error.html',
        controller: 'ErrorCtrl'
      });      
  });