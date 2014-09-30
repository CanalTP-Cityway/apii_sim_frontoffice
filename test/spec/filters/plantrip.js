'use strict';

describe('Filter: plantrip', function () {

  // load the filter's module
  beforeEach(module('plantripApp'));

  // initialize a new instance of the filter before each test
  var plantrip;
  beforeEach(inject(function ($filter) {
    plantrip = $filter('plantrip');
  }));

  it('should return the input prefixed with "plantrip filter:"', function () {
    var text = 'angularjs';
    expect(plantrip(text)).toBe('plantrip filter: ' + text);
  });

});
