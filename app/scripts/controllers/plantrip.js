'use strict';

/**
 * @ngdoc function
 * @name plantripApp.controller:MainCtrl
 * @description # MainCtrl Controller of the plantripApp
 */
angular
		.module('plantripApp')
		.controller(
				'PlantripCtrl',
				[
						'$scope',
						'$rootScope',
						'$q',
						'$log',
						'$sessionStorage',
						'$http',
						'Sim',
						function($scope, $rootScope, $q, $log, $sessionStorage,
								$http, Sim) {

							// 'http://open.mapquestapi.com/nominatim/v1/search'
							// 'http://nominatim.openstreetmap.org/search'
							var URL = 'http://nominatim.openstreetmap.org/search';
							var REVERSE_URL = 'http://nominatim.openstreetmap.org/reverse';

							var DEFAULT = {
								departure : '',
								departurePlace : undefined,
								arrival : '',
								arrivalPlace : undefined,
								arrivalDepartureTimeConstraint : "false",
								arrivalDepartureDate : new Date(),
								arrivalDepartureTime : new Date(),
								accessibilityConstraint : false,
								maxTrips : 5,
								transportMode : [ 'ALL' ],
								algorithm : 'CLASSIC',
								language : 'fr',
								departureAccessMode : [],
								arrivalAccessMode : []
							};

							$scope.parameters_tooltip = "Parameters";
							$scope.state = false;

							$scope.$storage = $sessionStorage.$default(DEFAULT);

							$scope.opened = false;

							$scope.open = function($event) {
								$event.preventDefault();
								$event.stopPropagation();
								$scope.opened = !$scope.opened;
							};

							$scope.execute = function() {
								Sim.cancellation(createPlanTripCancellationRequest());
								Sim.clear();
								$rootScope.$broadcast('solution', -1, null);
								Sim.send(createPlanTripRequestType());
							};

							$scope.reset = function() {
								Sim.cancellation(createPlanTripCancellationRequest());
								$scope.$storage = DEFAULT;
								$rootScope.model.arrival.lat = 0;
								$rootScope.model.arrival.lng = 0;
								$rootScope.model.departure.lat = 0;
								$rootScope.model.departure.lng = 0;
								Sim.clear();
								$rootScope.$broadcast('solution', -1, null);								
							};

							$scope.reverse = function() {
								var lng = $scope.model.departure.lng;
								var lat = $scope.model.departure.lat;
								$scope.model.departure.lng = $scope.model.arrival.lng;
								$scope.model.departure.lat = $scope.model.arrival.lat;
								$scope.model.arrival.lng = lng;
								$scope.model.arrival.lat = lat;
							};

							$scope.onSelectDeparture = function($item, $model,
									$label) {
								$scope.$storage.departurePlace = $item;
							};

							$scope.onSelectArrival = function($item, $model,
									$label) {
								$scope.$storage.arrivalPlace = $item;
							};

							$scope
									.$watch(
											'$storage.departurePlace',
											function(value) {
												if (value) {
													$rootScope.model.departure.lng = parseFloat(value.lon);
													$rootScope.model.departure.lat = parseFloat(value.lat);
												}
											});

							$scope
									.$watch(
											'$storage.arrivalPlace',
											function(value) {
												if (value) {
													$rootScope.model.arrival.lng = parseFloat(value.lon);
													$rootScope.model.arrival.lat = parseFloat(value.lat);
												}
											});

							$scope
									.$watch(
											'model.departure',
											function(value) {
												if (value.lng != 0
														&& value.lat != 0
														&& value.lng != $scope.$storage.departurePlace.lng
														&& value.lat != $scope.$storage.departurePlace.lat) {
													$scope
															.getReverseAddresses(
																	value.lng,
																	value.lat,
																	function(
																			result) {
																		$scope.$storage.departurePlace = result.data;
																		$scope.$storage.departure = result.data.display_name;
																	});
												}

											}, true);

							$scope
									.$watch(
											'model.arrival',
											function(value) {
												if (value.lng != 0
														&& value.lat != 0
														&& value.lng != $scope.$storage.arrivalPlace.lng
														&& value.lat != $scope.$storage.arrivalPlace.lat) {
													$scope
															.getReverseAddresses(
																	value.lng,
																	value.lat,
																	function(
																			result) {
																		$scope.$storage.arrivalPlace = result.data;
																		$scope.$storage.arrival = result.data.display_name;
																	});
												}

											}, true);

							$scope.onTransportModeChange = function(array,
									value) {
								var values = Constant.toTransportMode(value);
								for (var i = 0; i < values.length; i++) {
									var index = array.indexOf(values[i]);
									if (index === -1) {
										array.push(values[i]);
									} else {
										array.splice(index, 1);
									}
								}
							}

							$scope.onAccessModeChange = function(array, value) {
								var values = Constant.toAccessMode(value);
								for (var i = 0; i < values.length; i++) {
									var index = array.indexOf(values[i]);
									if (index === -1) {
										array.push(values[i]);
									} else {
										array.splice(index, 1);
									}
								}
							}

							$scope.isItemSelected = function(array, value) {
								return (array.indexOf(value) != -1)
							}

							$scope.getAddresses = function(value) {
								return $http.get(URL, {
									params : {
										q : value,
										countrycodes : 'fr',
										addressdetails : 1,
										format : 'json'
									}
								}).then(function(result) {
									return result.data;
								});
							};

							$scope.getReverseAddresses = function(lng, lat,
									callback) {

								return $http.get(REVERSE_URL, {
									params : {
										lon : lng,
										lat : lat,
										zoom : 18,
										addressdetails : 1,
										format : 'json'
									}
								}).then(callback);
							};

							$scope.hasError = function(name, fields) {
								if (fields === undefined) {
									fields = [ name ];
								}

								var control = $scope.plantripForm[name];

								var result = false;
								if ($scope.model !== undefined) {
									if ($scope.model.plantrip.response !== null) {
										if ($scope.model.plantrip.response.PlanTripResponse.Status != 0) {
											var errors = $scope.model.plantrip.response.PlanTripResponse.errors;
											loop: for ( var i in errors) {
												for ( var j in fields) {
													if (errors[i].Field == fields[j]) {
														result = true;
														if (result) {
															control.$dirty = true;
														}
														break loop;
													}
												}
											}
										}
									}
								}
								return control.$invalid || result;
							};

							$scope.errorMessage = function(name, fields) {
								var result = "";
								if (fields === undefined) {
									fields = [ name ];
								}

								if ($scope.model !== undefined) {
									if ($scope.model.plantrip.response !== null) {
										if ($scope.model.plantrip.response.PlanTripResponse.Status != 0) {
											var errors = $scope.model.plantrip.response.PlanTripResponse.errors;
											loop: for ( var i in errors) {
												for ( var j in fields) {
													if (errors[i].Field == name) {
														result = errors[i].Message;
														break loop;
													}
												}
											}
										}
									}
								}
								return result;
							};

							function createPlanTripCancellationRequest() {
								var value = -1;
								if ($scope.model.responses.starting) {
									value = $scope.model.responses.starting.StartingSearch.RequestId;
								}
								
								var message = {
									PlanTripCancellationRequest : {
										requestId : value
									}
								};
								return message;
							}

							function createPlanTripRequestType() {

								var message = {
									PlanTripRequestType : {
										Departure : {
											Position : {
												Longitude : $scope.model.departure.lng,
												Latitude : $scope.model.departure.lat
											}
										},
										Arrival : {
											Position : {
												Longitude : $scope.model.arrival.lng,
												Latitude : $scope.model.arrival.lat
											}
										},
										MaxTrips : $scope.$storage.maxTrips,
										Algorithm : $scope.$storage.algorithm,
										modes : $scope.$storage.transportMode,
										selfDriveConditions : [],
										AccessibilityConstraint : $scope.$storage.accessibilityConstraint,
										Language : $scope.$storage.language,
										clientRequestId : new Date().getTime()
									}
								};

								if ($scope.$storage.arrivalDepartureTimeConstraint == "false") {
									delete message.PlanTripRequestType.ArrivalTime;
									message.PlanTripRequestType.DepartureTime = moment(
											$scope.$storage.arrivalDepartureTime)
											.format('YYYY-MM-DDTHH:mm:ss');

								} else {
									delete message.PlanTripRequestType.DepartureTime;
									message.PlanTripRequestType.ArrivalTime = moment(
											$scope.$storage.arrivalDepartureTime)
											.format('YYYY-MM-DDTHH:mm:ss');
								}

								for ( var i in $scope.$storage.departureAccessMode) {
									var value = {
										SelfDriveMode : $scope.$storage.departureAccessMode[i],
										TripPart : 'DEPARTURE'
									};
									message.PlanTripRequestType.selfDriveConditions
											.push(value);
								}

								for ( var i in $scope.$storage.arrivalAccessMode) {
									var value = {
										SelfDriveMode : $scope.$storage.arrivalAccessMode[i],
										TripPart : 'ARRIVAL'
									};
									message.PlanTripRequestType.selfDriveConditions
											.push(value);
								}

								return message;
							}
						} ]);
