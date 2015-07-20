'use strict';

describe('Service: inviteService', function () {

  // load the service's module
  module('webrtcTestApp');

  var inviteService;



  beforeEach(function(){
    module('webrtcTestApp');
    inject(function (_inviteService_) {
      inviteService=_inviteService_;
    });

  });

  //no invitations yes
  it('No invitations', function () {
    expect(inviteService.isThereAnyInvitation()).toBe(false);
  });


  //invitation from some host
  var hostName='hostName';
  it('Invitation from '+hostName+' should exist', function () {
    inviteService.invite(hostName);

    expect(inviteService.isThereAnyInvitation()).toBe(true);
  });

  //consume invitation
  it('Invitation host should be the same as original host '+hostName+' and invitation is consumed', function(){
    inviteService.invite(hostName);

    var hostFromInvitation;
    inviteService.consumeInvitation(function(invitationHostname){
      hostFromInvitation=invitationHostname;
    });

    expect(hostFromInvitation).toBe(hostName);
    expect(inviteService.isThereAnyInvitation()).toBe(false);

  });





});