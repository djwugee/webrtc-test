'use strict';

describe('Controller: FacebookCtrl', function () {

  // load the controller's module
  beforeEach(module('webrtcTestApp'));

  var FacebookCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FacebookCtrl = $controller('FacebookCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
