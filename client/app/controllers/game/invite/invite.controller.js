'use strict';

angular.module('webrtcTestApp')
  .controller('InviteCtrl', function ($rootScope,$scope,$log,$stateParams,inviteService,$state) {
    
    var hostname= $stateParams.host;
    $log.info('Loading invite game controller with host '+hostname);

    //load hostname in parent scope
    inviteService.invite(hostname);

    $state.go($rootScope.LOGIN_STATE);

  });
