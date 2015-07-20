'use strict';

angular.module('webrtcTestApp')
  .service('inviteService', function ($log) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var invitingHost=null;


    function invite(hostName){
      $log.info('Invitation from '+hostName);
      invitingHost=hostName;
    }

    function isThereAnyInvitation(){
      return invitingHost!==null;
    }

    function consumeInvitation(callback){
      if(isThereAnyInvitation()){
        $log.info('Consuming invitation from '+invitingHost);

        //consume invitation
        callback(invitingHost);

        //clear invitation (so no more once is used)
        invitingHost=null;
      }else{
        $log.info('No invitations');
      }


    }

    return {
      invite:invite,
      isThereAnyInvitation:isThereAnyInvitation,
      consumeInvitation:consumeInvitation
    };

  });
