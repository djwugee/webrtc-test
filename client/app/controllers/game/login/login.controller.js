'use strict';

angular.module('webrtcTestApp')
  .controller('LoginCtrl', function ($scope,$log,$state) {
    $log.debug('LoginCtrl');
    
    $scope.registerPlayer=function(){
      $state.go('main.game.registeringPlayer',{userName:$scope.user.name});
    };

  });
