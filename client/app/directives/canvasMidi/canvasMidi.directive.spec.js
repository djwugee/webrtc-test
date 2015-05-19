'use strict';

describe('Directive: canvasMidi', function () {

  // load the directive's module
  beforeEach(module('webrtcTestApp'));

  
  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
    canvasMidi = $controller('canvasMidi', {
      $scope: scope
    });    
  }));
  
  /*
  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<canvas-midi></canvas-midi>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the canvasMidi directive');
  }));
*/
});