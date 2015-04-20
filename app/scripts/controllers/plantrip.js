'use strict';

/**
 * @ngdoc function
 * @name apiiSimFrontofficeApp.controller:MainCtrl
 * @description # MainCtrl Controller of the apiiSimFrontofficeApp
 */
angular
		.module('apiiSimFrontofficeApp')
		.controller(
				'PlantripCtrl',
				[
						'$scope',
						'$rootScope',
						'$log',
						'$sessionStorage',
						'$http',
						'$location',
						'$locale',
						'gettextCatalog',
						'Sim',
						'Config',
						function($scope, $rootScope, $log, $sessionStorage, $http, $location, $locale, gettextCatalog, Sim, Config) {

							$scope.lang = 'fr';
							$scope.minDate = new Date();

							// 'http://open.mapquestapi.com/nominatim/v1/search'
							// 'http://nominatim.openstreetmap.org/search'
							var URL = 'http://nominatim.openstreetmap.org/search';
							var REVERSE_URL = 'http://nominatim.openstreetmap.org/reverse';
							var DEFAULT = {
								departure : '',
								departurePlace : undefined,
								arrival : '',
								arrivalPlace : undefined,
								arrivalDepartureTimeConstraint : 'false',
								arrivalDepartureDate : new Date(),
								arrivalDepartureTime : new Date(),
								accessibilityConstraint : false,
								maxTrips : 5,
								transportMode : [ 'ALL' ],
								algorithm : 'CLASSIC',
								language : $locale.id,
								departureAccessMode : [],
								arrivalAccessMode : []
							};

							$scope.open = function($event) {
								$event.preventDefault();
								$event.stopPropagation();
								$scope.opened = !$scope.opened;
							};

							$scope.execute = function() {
								Sim.cancellation(createPlanTripCancellationRequest());
								Sim.clear();
								$rootScope.$broadcast('solution', -1, null);
								encodeURL();
								Sim.send(createPlanTripRequestType());
							};

							$scope.reset = function() {
								Sim.cancellation(createPlanTripCancellationRequest());
								$sessionStorage.$reset();
								$scope.$storage = $sessionStorage.$default(DEFAULT);
								$scope.model.departure.lng = 0;
								$scope.model.departure.lat = 0;
								$scope.model.arrival.lng = 0;
								$scope.model.arrival.lat = 0;
								$scope.$storage.arrivalDepartureDate = new Date();
								$scope.$storage.arrivalDepartureTime = new Date();
								$location.search({});
								Sim.clear();
								$rootScope.$broadcast('solution', -1, null);
								$rootScope.$broadcast('reset');
							};

							$scope.reverse = function() {
								var lng = $scope.model.departure.lng;
								var lat = $scope.model.departure.lat;
								$scope.model.departure.lng = $scope.model.arrival.lng;
								$scope.model.departure.lat = $scope.model.arrival.lat;
								$scope.model.arrival.lng = lng;
								$scope.model.arrival.lat = lat;
							};

							$scope.onSelectDeparture = function($item, $model, $label) {
								$scope.$storage.departurePlace = $item;
							};

							$scope.onSelectArrival = function($item, $model, $label) {
								$scope.$storage.arrivalPlace = $item;
							};

							$scope.$watch('$storage.departurePlace', function(value) {
								if (value) {
									$rootScope.model.departure.lng = parseFloat(value.lon);
									$rootScope.model.departure.lat = parseFloat(value.lat);
								}
							});

							$scope.$watch('$storage.arrivalPlace', function(value) {
								if (value) {
									$rootScope.model.arrival.lng = parseFloat(value.lon);
									$rootScope.model.arrival.lat = parseFloat(value.lat);
								}
							});

							$scope.$watch('model.departure', function(value) {
								if (!isNaN(value.lng) && !isNaN(value.lat)) {
									if ($scope.$storage.departurePlace === undefined
											|| value.lng != $scope.$storage.departurePlace.lon
											|| value.lat != $scope.$storage.departurePlace.lat) {
										if (!(value.lat == 0 && value.lng == 0)) {
											$scope.getReverseAddresses(value.lng, value.lat, function(result) {
												$scope.$storage.departurePlace = result.data;
												$scope.$storage.departure = $scope.formatAddresses(result.data);

											});
										}
									}
								}
							}, true);

							$scope.$watch('model.arrival', function(value) {
								if (!isNaN(value.lng) && !isNaN(value.lat)) {
									if ($scope.$storage.arrivalPlace === undefined || value.lng != $scope.$storage.arrivalPlace.lon
											|| value.lat != $scope.$storage.arrivalPlace.lat) {
										if (!(value.lat == 0 && value.lng == 0)) {
											$scope.getReverseAddresses(value.lng, value.lat, function(result) {
												$scope.$storage.arrivalPlace = result.data;
												$scope.$storage.arrival = $scope.formatAddresses(result.data);
											});
										}
									}
								}
							}, true);

							$scope.onTransportModeChange = function(array, value) {
								var values = Constant.toTransportMode(value);
								for (var i = 0; i < values.length; i++) {
									var index = array.indexOf(values[i]);
									if (index === -1) {
										array.push(values[i]);
									} else {
										array.splice(index, 1);
									}
								}
							};

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
							};

							$scope.isItemSelected = function(array, value) {
								return (array.indexOf(value) !== -1);
							};

							$scope.getAddresses = function(value) {

								var bounds = '-180,90,180,-90';
								if ($scope.config !== undefined) {
									bounds = $scope.config.bounds[0][1].toString() + ',' + $scope.config.bounds[1][0].toString()
											+ ',' + $scope.config.bounds[1][1].toString() + ','
											+ $scope.config.bounds[0][0].toString();
								}

								return $http.get(URL, {
									params : {
										q : value,
										addressdetails : 1,
										countrycodes : 'fr',
										zoom : 18,
										format : 'json',
										bounded : 1,
										viewbox : bounds
									}
								}).then(function(values) {
									var result = values.data.filter($scope.filterAddresses).map($scope.updateAddresses);
									return result;
								});
							};

							$scope.filterAddresses = function(value) {
								var array = [
										(value.class == 'boundary' && value.type == 'administrative' && value.address.city),
										(value.class == 'place' && (value.type == 'hamlet' || value.type == 'house'
												|| value.type == 'city' || value.type == 'locality')), (value.class == 'building'),
										(value.class == 'highway') ]

								return array.some(function(value) {
									return value
								}, this);
							};

							$scope.updateAddresses = function(value) {
								value.label = $scope.formatAddresses(value);
								return value;
							};

							$scope.formatAddresses = function(value) {
								var address = value.address;
								var result = '';

								if (address) {
									result += address.place_of_worship || address.station || address.bus_stop
											|| address.information || address.address26 || address.building || '';
									result += ' ';
									result += address.house_number || '';
									result += ' ';
									result += address.cycleway || address.road || address.address26 || address.pedestrian || '';
									result += ' ';
									result += address.postcode || '';
									result += ' ';
									result += address.city_district || address.city || address.town || address.village
											|| address.hamlet || '';
									result += ' ';
									result += address.state || address.country || '';

								} else {
									result = value.display_name;
								}
								return result;
							};

							$scope.getReverseAddresses = function(lng, lat, callback) {

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

							$scope.arrivalDepartureTimeHasError = function(name, fields) {
								var now = new Date();
								var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
								if ($scope.$storage.arrivalDepartureDate) {
									// var value =
									// $scope.$storage.arrivalDepartureDate;
									var value = moment($scope.$storage.arrivalDepartureDate).toDate();
									// console.log(value);
									var d2 = new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);
									if (d2.getTime() - d1.getTime() < 0) {
										return true;
									}
								} else {
									return true;
								}

								return $scope.hasError(name, fields);
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
													if (errors[i].Field === fields[j]) {
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
								var result = '';
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

							function encodeURL() {
								var param = {
									'd_lng' : $rootScope.model.departure.lng,
									'd_lat' : $rootScope.model.departure.lat,
									'a_lng' : $rootScope.model.arrival.lng,
									'a_lat' : $rootScope.model.arrival.lat,
									'time' : new Date($scope.$storage.arrivalDepartureTime).getTime(),
									'a_time' : $scope.$storage.arrivalDepartureTimeConstraint
								};
								// $log.info('[DSU] encode URL' +
								// JSON.stringify(param));
								$location.search(param);
							}

							function decodeURL() {
								var param = $location.search();
								// $log.info('[DSU] decode URL' +
								// JSON.stringify(param));
								if (param.d_lng) {
									$rootScope.model.departure.lng = parseFloat(param.d_lng);
								}
								if (param.d_lat) {
									$rootScope.model.departure.lat = parseFloat(param.d_lat);
								}
								if (param.a_lng) {
									$rootScope.model.arrival.lng = parseFloat(param.a_lng);
								}
								if (param.a_lat) {
									$rootScope.model.arrival.lat = parseFloat(param.a_lat);
								}
								if (param.time) {
									$scope.$storage.arrivalDepartureTime = new Date().setTime(param.time);
								}
								if (param.a_time) {
									$scope.$storage.arrivalDepartureTimeConstraint = param.a_time;
								}
							}

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
										Language : $locale.id,
										clientRequestId : new Date().getTime()
									}
								};

								var date, time;
								if ($scope.$storage.arrivalDepartureTimeConstraint === 'false') {
									delete message.PlanTripRequestType.ArrivalTime;
									date = moment($scope.$storage.arrivalDepartureDate).format('YYYY-MM-DD');
									time = moment($scope.$storage.arrivalDepartureTime).format('HH:mm:ss');
									message.PlanTripRequestType.DepartureTime = date + 'T' + time;
								} else {
									delete message.PlanTripRequestType.DepartureTime;
									date = moment($scope.$storage.arrivalDepartureDate).format('YYYY-MM-DD');
									time = moment($scope.$storage.arrivalDepartureTime).format('HH:mm:ss');
									message.PlanTripRequestType.ArrivalTime = date + 'T' + time;
								}

								for ( var i in $scope.$storage.departureAccessMode) {
									var value = {
										SelfDriveMode : $scope.$storage.departureAccessMode[i],
										TripPart : 'DEPARTURE'
									};
									message.PlanTripRequestType.selfDriveConditions.push(value);
								}

								for ( var j in $scope.$storage.arrivalAccessMode) {
									var value = {
										SelfDriveMode : $scope.$storage.arrivalAccessMode[j],
										TripPart : 'ARRIVAL'
									};
									message.PlanTripRequestType.selfDriveConditions.push(value);
								}

								return message;
							}

							function initialize() {

								Config.getConfig().then(function(result) {
									$scope.config = result;
								});
								$scope.opened = false;
								$scope.$storage = $sessionStorage.$default(DEFAULT);
								$scope.$storage.arrivalDepartureDate = new Date($scope.$storage.arrivalDepartureDate);
								$scope.$storage.arrivalDepartureTime = new Date($scope.$storage.arrivalDepartureTime);
								decodeURL();
							}

							initialize();
						} ]);
