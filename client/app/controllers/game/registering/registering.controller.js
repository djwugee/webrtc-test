'use strict';

angular.module('webrtcTestApp')
  .controller('RegisteringPlayerCtrl', function ($stateParams,$rootScope,$scope,$log,$midiService,$http,$state) {

    var loginState='main.game.login';


    //get name from scope or url
    $log.debug('Retrieving username from scope or stateParams',$scope.user,$stateParams.userName);
    $scope.user.name= $scope.user.name || $stateParams.userName;


    function registerPlayer(userName){
      // TODO deleted
      $rootScope.pMBlocalPlayerName=userName;

      //TODO make a service
      $rootScope.pMBtelScaleWebRTCPhoneController.register(userName);
    }


    $log.debug('Registering player '+$scope.user.name);
    //if no username --> go to login
    if(!$scope.user.name){
      $log.debug('No username, go to state: '+loginState);
      $state.go(loginState);
    } else {
      $log.debug('Registering player '+$scope.user.name);
      //SIP register
      registerPlayer($scope.user.name);

    }




    $rootScope.$on('playmyband.webrtc.client.opened',function(){
      $state.go('main.selectSong');
      try
      {
        if ($rootScope.pMBtelScaleWebRTCPhoneController.audio || $rootScope.pMBtelScaleWebRTCPhoneController.video)
        {
          this.getLocalUserMedia($rootScope.pMBtelScaleWebRTCPhoneController.DEFAULT_LOCAL_VIDEO_FORMAT);
        }
      }
      catch(exception)
      {
          console.error('TelScaleWebRTCPhoneController:onWebRTCommClientOpenedEvent(): catched exception: '+exception);
          console.error('TelScaleWebRTCPhoneController:onWebRTCommClientOpenedEvent(): catched exception: '+exception);
      }       
    });



    $rootScope.$on('playmyband.webrtc.client.openError',function(){
      $state.go('main.error');
    });    

    

  });
