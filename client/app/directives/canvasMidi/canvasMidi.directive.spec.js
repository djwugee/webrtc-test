'use strict';

describe('Directive: canvasMidi', function () {

  // load the directive's module
  beforeEach(module('webrtcTestApp'));

  
  var scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();   
  }));
  
  
  it('should create a div mainPlayerCanvas', inject(function ($compile) {
    var element = angular.element('<canvas-midi></canvas-midi>');
    element = $compile(element)(scope);
    var mainPlayerCanvas= element.find('.mainPlayerCanvas');
    expect(typeof mainPlayerCanvas).toBe('object');

  }));

});