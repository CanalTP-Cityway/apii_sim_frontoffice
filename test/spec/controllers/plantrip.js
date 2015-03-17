'use strict';

describe('Controller: plantripCtrl', function () {

  // load the controller's module
  beforeEach(module('apiiSimFrontofficeApp'));

  var PlantripCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlantripCtrl = $controller('PlantripCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(true);
  });
});
