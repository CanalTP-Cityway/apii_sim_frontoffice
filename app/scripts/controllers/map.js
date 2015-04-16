'use strict';

/**
 * @ngdoc function
 * @name apiiSimFrontofficeApp.controller:MapCtrl
 * @description # MapCtrl Controller of the apiiSimFrontofficeApp
 */
angular.module('apiiSimFrontofficeApp').controller(
		'MapCtrl',
		[
				'$scope',
				'$rootScope',
				'$log',
				'Sim',
				'leafletData',
				'$timeout',
				'gettextCatalog',
				'Config',
				'$compile',
				function($scope, $rootScope, $log, Sim, leafletData, $timeout, gettextCatalog, Config, $compile) {

					$scope.setDeparture = function(lng, lat) {
						leafletData.getMap().then(function(map) {
							map.closePopup();
						});
						$rootScope.model.departure.lng = parseFloat(lng);
						$rootScope.model.departure.lat = parseFloat(lat);
					};

					$scope.setArrival = function(lng, lat) {
						leafletData.getMap().then(function(map) {
							map.closePopup();
						});
						$rootScope.model.arrival.lng = parseFloat(lng);
						$rootScope.model.arrival.lat = parseFloat(lat);
					};

					$scope.$watch('model.departure', function(value) {
						if (value && !$scope.markers.departure) {

							if (!(isNaN(value.lat) || isNaN(value.lng))) {
								$scope.markers.departure = value;
							}
						}
					}, true);

					$scope.$watch('model.arrival', function(value) {
						if (value && !$scope.markers.arrival) {
							if (!(isNaN(value.lat) || isNaN(value.lng))) {
								$scope.markers.arrival = value;
							}
						}
					}, true);

					$scope.$on('leafletDirectivePath.click', function(event, data) {
						if (data.pathName.substr(0, 2) === 'p_') {
							$rootScope.$broadcast('map', data.pathName.slice(2));
						}
					});

					$scope.$on('leafletDirectiveMap.contextmenu', function(event, data) {
						leafletData.getMap().then(
								function(map) {
									var latlng = data.leafletEvent.latlng;
									var template = '<div class="btn-group" role="group">'
											+ '<div><img src="images/marker-green.png" height="20" width="12"/>'
											+ '<a class="btn btn-link" ng-click="setDeparture(' + latlng.lng + ',' + latlng.lat
											+ ')" translate >Departure</a></div>'
											+ '<div><img src="images/marker-red.png"  height="20" width="12"/>'
											+ '<a class="btn btn-link" ng-click="setArrival(' + latlng.lng + ',' + latlng.lat
											+ ')" translate >Arrival</a></div>' + '</div>';

									var link = $compile(angular.element(template));
									var content = link($scope)[0];
									var popup = L.popup({
										maxWidth : 83,
										closeButton : false
									});
									popup.setContent(content);
									popup.setLatLng(latlng);
									popup.openOn(map);
								});
					});

					$scope.$on('leafletDirectiveMarker.click', function(event, data) {

						if (data.markerName === 'arrival' || data.markerName === 'departure') {
							return;
						}

						leafletData.getMap().then(function(map) {
							var latlng = data.leafletEvent.latlng;
							var marker = $scope.markers[data.markerName];
							if (marker) {

								var template = createMessage(marker);

								var link = $compile(angular.element(template));
								var content = link($scope)[0];
								var popup = L.popup({
									closeButton : false
								});
								popup.setContent(content);
								popup.setLatLng(latlng);
								popup.openOn(map);
							}
						});

					});

					$scope.$on('reset', function() {
						Config.getConfig().then(function(result) {
							leafletData.getMap().then(function(map) {
								map.fitBounds(result.bounds);
							});
						});
					});

					$scope.$on('solution', function(event, index, data) {
						$scope.solution.index = index;
						$scope.solution.data = data;
						update();
					});

					$scope.$on('detail', function(event, index, data) {

						$scope.detail.index = index;
						$scope.detail.data = data;

						var bounds = null;
						if (data.Leg) {
							bounds = getBounds(data.Leg.Departure, data.Leg.Arrival);
						} else {
							bounds = getBounds(data.PTRide.Departure, data.PTRide.Arrival);
						}

						var delta = ($('#solution').offset().left + $('#solution').width()) / 2;

						pan(bounds, delta);

						for ( var i in $scope.paths) {
							$scope.paths[i].color = $scope.paths[i].stroke_color;
							$scope.paths[i].weight = $scope.paths[i].stroke_weight;
						}
						$scope.paths['p_' + index].color = '#777';
						$scope.paths['p_' + index].weight = 7;

					});

					function initialize() {

						var url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
						if ($rootScope.debug) {
							// url =
							// 'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png';
							url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
						}

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

						angular.extend($rootScope.model.departure, {
							icon : local_icons.marker_green,
							focus : false,
							zIndexOffset : 1000,
							draggable : true
						});

						angular.extend($rootScope.model.arrival, {
							icon : local_icons.marker_red,
							focus : false,
							zIndexOffset : 1000,
							draggable : true
						});

						angular.extend($scope, {
							center : {
								lat : 46.76844,
								lng : 2.432613,
								zoom : 6
							},
							defaults : {
								tileLayer : url,
								maxZoom : 19,
								zoomControl : true,
								zoomControlPosition : 'topright',
								path : {}
							},
							icons : local_icons,
							markers : {
							// arrival : $rootScope.model.arrival,
							// departure : $rootScope.model.departure
							},
							paths : {},
							events : {
								map : {
									enable : [ 'contextmenu' ],
									logic : 'emit'
								},
								path : {
									enable : [ 'click' ],
									logic : 'emit'
								}
							},
							solution : {},
							detail : {}
						});

						Config.getConfig().then(function(result) {
							leafletData.getMap().then(function(map) {
								map.fitBounds(result.bounds);

							});
						});
					}

					function pan(bounds, delta) {

						leafletData.getMap().then(function(map) {

							var center = bounds.getCenter();
							var point = map.latLngToContainerPoint(center);
							var latlng = map.containerPointToLatLng([ point.x - delta, point.y ]);
							var zoom = map.getBoundsZoom(bounds);

							map.setView(latlng, zoom - 1, {
								animate : false
							});

						});
					}

					function getBounds(departure, arrival) {
						var lng1 = Math.min(departure.TripStopPlace.Position.Longitude, arrival.TripStopPlace.Position.Longitude);
						var lng2 = Math.max(departure.TripStopPlace.Position.Longitude, arrival.TripStopPlace.Position.Longitude);
						var lat1 = Math.min(departure.TripStopPlace.Position.Latitude, arrival.TripStopPlace.Position.Latitude);
						var lat2 = Math.max(departure.TripStopPlace.Position.Latitude, arrival.TripStopPlace.Position.Latitude);
						var bounds = L.latLngBounds(L.latLng(lat1, lng1), L.latLng(lat2, lng2));
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
								if (arrival === null) {
									arrival = departure;
								}

								var marker = createMarker(section, step, arrival, departure, 0, mode);
								$scope.markers['m_' + i + '_0'] = marker;

								if (i === (array.length - 1)) {
									marker = createMarker(section, step, section.Arrival, section.Arrival, 0, mode);
									$scope.markers['m_' + i + '_1'] = marker;
								}

								var path = {
									stroke_color : '#03f',
									stroke_weight : 5,
									opacity : 0.6,
									title : (section.Line) ? section.Line.Number : '',
									latlngs : []
								};

								if (mode === 'foot') {
									path.stroke_color = '#0f0';
								}

								path.color = path.stroke_color;
								path.weight = path.stroke_weight;

								if (steps) {

									for (var j = 0; j < steps.length; j++) {
										step = steps[j];

										// create step marker
										departure = step.Departure;

										if (j > 0 && j < steps.length) {
											marker = createMarker(section, step, arrival, departure, 1, mode);
											$scope.markers['m_' + i + '_' + j + '_0'] = marker;
										}
										arrival = step.Arrival;

										// create section path
										var lng = step.Departure.TripStopPlace.Position.Longitude;
										var lat = step.Departure.TripStopPlace.Position.Latitude;
										if (lng !== 0 && lat !== 0) {
											path.latlngs.push({
												lat : lat,
												lng : lng
											});
										}

										lng = step.Arrival.TripStopPlace.Position.Longitude;
										lat = step.Arrival.TripStopPlace.Position.Latitude;
										if (lng !== 0 && lat !== 0) {
											path.latlngs.push({
												lat : lat,
												lng : lng
											});
										}
									}

								} else {

									// create section path
									path.latlngs.push({
										lat : section.Departure.TripStopPlace.Position.Latitude,
										lng : section.Departure.TripStopPlace.Position.Longitude
									});
									path.latlngs.push({
										lat : section.Arrival.TripStopPlace.Position.Latitude,
										lng : section.Arrival.TripStopPlace.Position.Longitude
									});

								}

								$scope.paths['p_' + i] = path;

								arrival = section.Arrival;
							}

						}
					}

					function createMarker(section, step, arrival, departure, type, mode) {

						var lng = departure.TripStopPlace.Position.Longitude;
						var lat = departure.TripStopPlace.Position.Latitude;
						var name = departure.TripStopPlace.Name;
						var city_name = departure.TripStopPlace.CityName || '';
						var line = (section.Line) ? section.Line.Number + ' - ' + section.Line.Name : '';
						var direction = section.StopHeadSign || '';

						var marker = {
							lng : lng,
							lat : lat,
							title : name,
							type : 'div',
							icon : {
								type : 'div',
								className : 'div-icon circle ' + ((type === 1) ? 'circle-1' : 'circle-0'),
								html : '<span class="' + Constant.toIconClass(mode) + '">',
								iconSize : [ 20, 20 ]
							},
							focus : false,
							draggable : false,
							data : {
								name : name,
								city_name : city_name || '',
								arrival : arrival.DateTime,
								departure : departure.DateTime,
								mode : mode,
								line : line || '',
								direction : direction
							}
						};

						return marker;
					}

					function createMessage(marker) {
						var icon = Constant.toIconClass(marker.data.mode);
						var arrival = moment.duration(marker.data.arrival).format('h [h] m [min]');
						var departure = moment.duration(marker.data.departure).format('h [h] m [min]');
						var header = '';
						if (marker.data.mode !== 'foot') {
							header = '<div class="popup-header">' + '<div>' + '<i class="' + icon + '"></i>'
									+ '{{ "Line" | translate}}' + ' ' + marker.data.line + '</div>' + '<div>'
									+ '{{ "Direction" | translate}}' + ' ' + marker.data.direction + '</div>' + '</div>';
						}

						var result = '<div id="popup">' + header + '<div><strong>' + marker.data.name + '</strong></div><div>'
								+ marker.data.city_name + '</div>'
								+ '<div class="arrival"><div><span class="glyphicon glyphicon-flag"></span>'
								+ '{{ "Arrival" | translate}}' + ' ' + arrival + '</div></div>'
								+ '<div class="departure"><div><span class="glyphicon glyphicon-flag"></span>'
								+ '{{ "Departure" | translate}}' + ' ' + departure + '</div></div></div>';

						return result;
					}

					function clear() {
						$scope.paths = {};
						for ( var key in $scope.markers) {
							if (key !== 'arrival' && key !== 'departure') {
								delete $scope.markers[key];
							}
						}
					}

					initialize();

				} ]);
