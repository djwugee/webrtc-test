'use strict';

angular.module('webrtcTestApp')
  .config(function ($stateProvider) {
    $stateProvider
    .state('main.game.selectSong', {
      url: '/selectSong',
      templateUrl: 'app/controllers/game/selectSong/selectSong.html',
      controller: 'SelectSongCtrl'
    });
  
  });

