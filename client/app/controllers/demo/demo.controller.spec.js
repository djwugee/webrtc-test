'use strict';

describe('Controller: DemoCtrl', function () {

  // load the controller's module
  beforeEach(module('webrtcTestApp'));

  var DemoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DemoCtrl = $controller('DemoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
