'use strict';

angular.module('webrtcTestApp')
  .controller('CanvasCtrl', function ($rootScope,$scope,$log) {
    $scope.message = 'Hello';
    $log.info('Loading canvas controller');

    $scope.idUserCanvas='mainPlayerCanvas';

    // capture keyboard event
    window.addEventListener( "keypress", doKeyDown, false );

    function doKeyDown(event){
      var note= event.keyCode - 49; // 49 = key 1

      if(note>=0 && note <=4){
        var eventName='user.note.event.'+$scope.idUserCanvas;
        $log.debug('sending note to user canvas '+eventName);
        $rootScope.$broadcast(eventName,note);
      }
    }

  });
