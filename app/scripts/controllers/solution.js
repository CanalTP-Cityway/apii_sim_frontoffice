'use strict';

/**
 * @ngdoc function
 * @name apiiSimFrontofficeApp.controller:SolutionCtrl
 * @description # SolutionCtrl Controller of the apiiSimFrontofficeApp
 */
angular
		.module('apiiSimFrontofficeApp')
		.controller(
				'SolutionCtrl',
				[
						'$scope',
						'$rootScope',
						'$log',
						function($scope, $rootScope, $log) {

	
							$scope.onSelect = function(index) {
								$scope.selected = index;
								var value = $scope.model.responses.entries[index];
								$rootScope.$broadcast('solution', index, value);
							};

							$scope.getConnectionCounter = function(response) {
								var result = "";
								var count = 0;
								if (response && response.body) {
									var value = response.body.PlanTripNotificationResponseType.ComposedTrip.sections;
									if (value) {
										for (var i = 0; i < value.length; i++) {
											if (value[i].Leg) {
												count++;
											}
										}
										if (value[0].Leg) {
											count--;
										}
										if (value[value.length - 1].Leg) {
											count--;
										}

										result = (count < 0) ? 0 : count;
									}
								}
								return result;
							}
							
							$scope.hasError = function() {
								return ( $scope.model.responses.ending 
								&& $scope.model.responses.ending.EndingSearch.NotificationsSent == 0);							
							}

						} ]);
