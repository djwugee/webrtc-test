'use strict';

describe('Controller: CanvasCtrl', function () {

  // load the controller's module
  beforeEach(module('webrtcTestApp'));

  var CanvasCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CanvasCtrl = $controller('CanvasCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
