'use strict';

angular.module('webrtcTestApp')
  .controller('RegisteringPlayerCtrl', function ($stateParams,$rootScope,$scope,$log,$midiService,$http,$state) {
    $log.info('RegisteringPlayerCtrl - entering');
    var loginState=$rootScope.LOGIN_STATE;
    var selectSongState= $rootScope.SELECT_SONG_STATE;
    var errorState=$rootScope.ERROR_STATE;


    //get name from scope or url
    $log.debug('RegisteringPlayerCtrl - Retrieving username from scope or stateParams',$scope.user,$stateParams.userName);
    $scope.user.name= $scope.user.name || $stateParams.userName;


    function registerPlayer(userName){
      // TODO deleted
      $rootScope.pMBlocalPlayerName=userName;

      //TODO make a service
      $rootScope.pMBtelScaleWebRTCPhoneController.register(userName);
    }


    //if no username --> go to login
    if(!$scope.user.name){
      $log.info('No username, go to state: '+loginState);
      $state.go(loginState);
    } else {
      $log.info('RegisteringPlayerCtrl - Registering player '+$scope.user.name);
      //SIP register
      registerPlayer($scope.user.name);

    }




    $rootScope.$on('playmyband.webrtc.client.opened',function(){
      $log.info('RegisteringPlayerCtrl - SIP register OK');
      try {
        if ($rootScope.pMBtelScaleWebRTCPhoneController.audio || $rootScope.pMBtelScaleWebRTCPhoneController.video){
          $log.debug('RegisteringPlayerCtrl - trying to get local user media');
          this.getLocalUserMedia($rootScope.pMBtelScaleWebRTCPhoneController.DEFAULT_LOCAL_VIDEO_FORMAT);
        }
      }catch(exception){
          $log.error('RegisteringPlayerCtrl - TelScaleWebRTCPhoneController:onWebRTCommClientOpenedEvent(): catched exception: ',exception);
      }       

      $log.info('RegisteringPlayerCtrl - going to select song state'+ selectSongState);
      $state.go(selectSongState);

    });



    $rootScope.$on('playmyband.webrtc.client.openError',function(){
      $log.info('RegisteringPlayerCtrl - SIP register KO, going to error state'+errorState);
      $state.go(errorState);
    });    

    

  });
