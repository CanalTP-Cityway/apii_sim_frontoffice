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
				'Config',
				function($scope, $rootScope, $log, Locale, $window, $timeout, Config) {

					$scope.groups = [ {
						open : true
					}, {
						open : false
					} ];

					$scope.disabled = true;

					$scope.$watch('model.responses.starting', function(value) {
						if (value != null) {
							$scope.groups[1].open = true;
						}
					});

					$scope.setLocale = function(locale) {
						Locale.setLocale(locale);
					}

					$scope.getLocale = function() {
						return Locale.getLocale();
					}

					$scope.$watch('model.departure', function(value) {
						$scope.groups[0].open = true;
					}, true);

					$scope.$watch('model.arrival', function(value) {
						$scope.groups[0].open = true;
					}, true);

					$scope.$on('solution', function(event, index, data) {
						$scope.disabled = (index >= 0) ? false : true;
					});

					$scope.print = function() {
						$.print("#map", {append: "#print-detail"});						
					};

					
					function initialize() {
						Locale.setLocale('fr');
						Config.getConfig().then(function(result) {
							$rootScope.config = result;
							$scope.contact = result.contact;
						})
					}

					initialize();

				} ]);
