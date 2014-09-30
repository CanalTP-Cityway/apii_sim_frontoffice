'use strict';

/**
 * @ngdoc function
 * @name plantripApp.controller:MapCtrl
 * @description # MapCtrl Controller of the plantripApp
 */
angular
		.module('plantripApp')
		.controller(
				'MapCtrl',
				[
						'$scope',
						'$rootScope',
						'$log',
						'Sim',
						'leafletData',
						'$timeout',
						function($scope, $rootScope, $log, Sim, leaflet,
								$timeout) {

							var local_icons = {
								default_icon : {},
								marker_green : {
									iconUrl : 'images/marker-green.png',
									shadowUrl : 'images/marker-shadow.png',
									iconSize : [ 25, 41 ],
									shadowSize : [ 41, 41 ],
									iconAnchor : [ 12, 41 ],
									popupAnchor : [ 1, -34 ]
								},
								marker_red : {
									iconUrl : 'images/marker-red.png',
									shadowUrl : 'images/marker-shadow.png',
									iconSize : [ 25, 41 ],
									shadowSize : [ 41, 41 ],
									iconAnchor : [ 12, 41 ],
									popupAnchor : [ 1, -34 ]
								}
							};

							angular
									.extend(
											$scope,
											{
												center : {
													lat : 46.76844,
													lng : 2.432613,
													zoom : 6
												},
												defaults : {
													tileLayer : "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
													maxZoom : 19,
													zoomControl : true,
													zoomControlPosition : 'topright',
													path : {}
												},
												icons : local_icons,
												markers : {},
												paths : {},
												events : {
													path : {
														enable : [ 'mouseover',
																'click' ],
														logic : 'emit'
													}
												},
												solution : {},
												detail : {}
											});

							angular.extend($rootScope.model.departure, {
								icon : $scope.icons.marker_green,
								focus : false,
								zIndexOffset : 1000,
								draggable : true
							});

							angular.extend($rootScope.model.arrival, {
								icon : $scope.icons.marker_red,
								focus : false,
								zIndexOffset : 1000,
								draggable : true
							});

							$scope.markers['arrival'] = $rootScope.model.arrival;
							$scope.markers['departure'] = $rootScope.model.departure;

							$scope.$on('leafletDirectivePath.click', function(
									event, data) {
								if (data.pathName.substr(0, 2) === 'p_') {
									$rootScope.$broadcast('map', data.pathName
											.slice(2));
								}
							});

							$scope.$on('solution',
									function(event, index, data) {
										$scope.solution.index = index;
										$scope.solution.data = data;
										update();
									});

							$scope
									.$on(
											'detail',
											function(event, index, data) {

												$scope.detail.index = index;
												$scope.detail.data = data;

												var bounds = null;
												if (data.Leg) {
													bounds = getBounds(
															data.Leg.Departure,
															data.Leg.Arrival);
												} else {
													bounds = getBounds(
															data.PTRide.Departure,
															data.PTRide.Arrival);
												}

												var delta = ($('#solution')
														.offset().left + $(
														'#solution').width()) / 2;

												pan(bounds, delta);

												for ( var i in $scope.paths) {
													$scope.paths[i].color = $scope.paths[i].stroke_color;
												}
												$scope.paths['p_' + index].color = '#777';

											});

							function pan(bounds, delta) {

								leaflet
										.getMap()
										.then(
												function(map) {

													var center = bounds
															.getCenter();
													var point = map
															.latLngToContainerPoint(center);
													var latlng = map
															.containerPointToLatLng([
																	point.x
																			- delta,
																	point.y ]);
													var zoom = map
															.getBoundsZoom(bounds);

													map.setView(latlng,
															zoom - 1, {
																animate : false
															})

												});
							}

							function getBounds(departure, arrival) {
								var lng1 = Math
										.min(
												departure.TripStopPlace.Position.Longitude,
												arrival.TripStopPlace.Position.Longitude);
								var lng2 = Math
										.max(
												departure.TripStopPlace.Position.Longitude,
												arrival.TripStopPlace.Position.Longitude);
								var lat1 = Math
										.min(
												departure.TripStopPlace.Position.Latitude,
												arrival.TripStopPlace.Position.Latitude);
								var lat2 = Math
										.max(
												departure.TripStopPlace.Position.Latitude,
												arrival.TripStopPlace.Position.Latitude);
								var bounds = L.latLngBounds(L
										.latLng(lat1, lng1), L.latLng(lat2,
										lng2));
								return bounds;
							}

							function update() {

								clear();

								if ($scope.solution.data && $scope.solution.data.body) {
									var array = $scope.solution.data.body.PlanTripNotificationResponseType.ComposedTrip.sections;

									var section = null;
									var step = null;
									var arrival = null;

									for (var i = 0; i < array.length; i++) {
										var steps = null;
										var departure = null;

										var type = 0;
										var mode = null;

										if (array[i].PTRide) {
											section = array[i].PTRide;
											steps = section.steps;
											type = 0;
											mode = section.PublicTransportMode;
										}
										if (array[i].Leg) {
											section = array[i].Leg;
											steps = section.steps;
											type = 1;
											mode = 'foot';
										}

										// create section marker
										departure = section.Departure;
										if (arrival == null) {
											arrival = departure;
										}

										var marker = create(section, step,
												arrival, departure, 0, mode);
										$scope.markers['m_' + i + '_0'] = marker;

										if (i == (array.length -1)) {
											marker = create(section, step,
													section.Arrival, section.Arrival, 0, mode);
											$scope.markers['m_' + i + '_1'] = marker;
										}

										var path = {
											stroke_color : '#03f',
											weight : 5,
											opacity : 0.6,
											latlngs : []
										};
										
										if(mode == 'foot') {
											//path.dashArray = '5, 15, 5, 15';
											path.stroke_color  = '#0f0';
										}else{
											// delete path.dashArray;
										}
										
										path.color = path.stroke_color;

										if (steps) {

											for (var j = 0; j < steps.length; j++) {
												var step = steps[j];

												// create step marker
												departure = step.Departure;

												if (j > 0 && j < steps.length) {
													var marker = create(
															section, step,
															arrival, departure,
															1, mode);
													$scope.markers['m_' + i
															+ '_' + j + '_0'] = marker;
												}
												arrival = step.Arrival;

												// create section path
												var lng = step.Departure.TripStopPlace.Position.Longitude;
												var lat = step.Departure.TripStopPlace.Position.Latitude;
												if (lng != 0 && lat != 0) {
													path.latlngs.push({
														lat : lat,
														lng : lng
													});
												}

												lng = step.Arrival.TripStopPlace.Position.Longitude;
												lat = step.Arrival.TripStopPlace.Position.Latitude;
												if (lng != 0 && lat != 0) {
													path.latlngs.push({
														lat : lat,
														lng : lng
													});
												}
											}

										} else {

											// create section path
											path.latlngs
													.push({
														lat : section.Departure.TripStopPlace.Position.Latitude,
														lng : section.Departure.TripStopPlace.Position.Longitude
													});
											path.latlngs
													.push({
														lat : section.Arrival.TripStopPlace.Position.Latitude,
														lng : section.Arrival.TripStopPlace.Position.Longitude
													});

										}

										$scope.paths['p_' + i] = path;

										arrival = section.Arrival;
									}

								}
							}

							function create(section, step, arrival, departure,
									type, mode) {

								var lng = departure.TripStopPlace.Position.Longitude;
								var lat = departure.TripStopPlace.Position.Latitude;
								var name = departure.TripStopPlace.Name;
								var city_name = (departure.TripStopPlace.CityName) ? departure.TripStopPlace.CityName
										: "";
								var line = (section.Line) ? section.Line.Name
										: "";
								var direction = section.StopHeadSign;

								var marker = {
									type : 'div',
									icon : {
										type : 'div',
										className : 'div-icon circle '
												+ ((type == 1) ? 'circle-1'
														: 'circle-0'),
										html : '<span class="'
												+ Constant.toIconClass(mode)
												+ '">',
										iconSize : [ 20, 20 ]
									},
									focus : false,
									draggable : false
								};

								marker.lng = lng;
								marker.lat = lat;
								marker.title = name;

								marker.message = createPopup(name, city_name,
										arrival.DateTime, departure.DateTime,
										mode, line, direction)
								return marker;
							}

							function clear() {
								$scope.paths = {};
								for ( var key in $scope.markers) {
									if (key != "arrival" && key != "departure") {
										delete $scope.markers[key];
									}
								}
							}

							function createPopup(name, city_name, t0, t1, mode,
									line, direction) {
								var result = null;

								var icon = Constant.toIconClass(mode);
								var line = (line) ? line : "";
								var city_name = (city_name) ? city_name : "";

								var arrival = moment.duration(t0).format(
										'h [h] m [min]');
								var departure = moment.duration(t1).format(
										'h [h] m [min]');

								var header = "";

								if (mode != 'foot') {
									header = '<div class="popup-header"><i class="'
											+ icon
											+ '"></i> Ligne '
											+ line
											+ ' - Direction '
											+ direction
											+ '</div>';
								}

								result = '<div id="popup">'
										+ header
										+ '<div><strong>'
										+ name
										+ '</strong></div><div>'
										+ city_name
										+ '</div>'
										+ '<div class="arrival"><div><span class="glyphicon glyphicon-flag"></span>Arrivée '
										+ arrival
										+ '</div></div>'
										+ '<div class="departure"><div><span class="glyphicon glyphicon-flag"></span>Départ  '
										+ departure + '</div></div></div>';

								return result;

							}

						} ]);