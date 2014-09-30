'use strict';

describe('Controller: ResponseCtrl', function () {

  // load the controller's module
  beforeEach(module('plantripApp'));

  var ResponseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ResponseCtrl = $controller('ResponseCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.model.length).toBe(3);
  });
});
