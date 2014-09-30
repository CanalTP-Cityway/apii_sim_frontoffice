'use strict';

/**
 * @ngdoc function
 * @name plantripApp.controller:HomeCtrl
 * @description # HomeCtrl Controller of the plantripApp
 */
angular.module('plantripApp').controller('HomeCtrl', function($scope) {
	$scope.accordion_closed = true;
	$scope.accordion_opened = false;

	$scope.open = function(value) {
		$scope.accordion_opened = value;
		$scope.accordion_closed = !value;
	}

	$scope.$watch('model.responses.starting', function(value) {
		if (value != null) {
			$scope.open(true);
		}
	});

});
