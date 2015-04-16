'use strict';

/**
 * @ngdoc function
 * @name apiiSimFrontofficeApp.controller:HomeCtrl
 * @description # HomeCtrl Controller of the apiiSimFrontofficeApp
 */
angular.module('apiiSimFrontofficeApp').controller(
		'HomeCtrl',
		[
				'$scope',
				'$rootScope',
				'$log',
				'Locale',
				'$window',
				'$timeout',
				'$location',
				'Config',
				function($scope, $rootScope, $log, Locale, $window, $timeout, $location, Config) {

					$scope.groups = [ {
						open : true
					}, {
						open : false
					} ];

					$scope.disabled = true;

					$scope.$watch('model.responses.starting', function(value) {
						if (value) {
							$scope.groups[1].open = true;
						}
					});
					
					$scope.setLocale = function(locale) {
						Locale.setLocale(locale);
					};

					$scope.getLocale = function() {
						return Locale.getLocale();
					};

					$scope.$watch('model.departure', function() {
						$scope.groups[0].open = true;
					}, true);

					$scope.$watch('model.arrival', function() {
						$scope.groups[0].open = true;
					}, true);

					$scope.$on('solution', function(event, index) {
						$scope.disabled = (index >= 0) ? false : true;
					});

					$scope.print = function() {
						$.print('#map', {append: '#print-detail'});						
					};

					
					function initialize() {
						Locale.setLocale('fr');
						Config.getConfig().then(function(result) {
							$rootScope.config = result;
						});
						$rootScope.debug = ($location.port() === 9000) ? true : false;
					}

					initialize();

				} ]);
