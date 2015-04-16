'use strict';

/**
 * @ngdoc function
 * @name apiiSimFrontofficeApp.controller:DetailCtrl
 * @description # DetailCtrl Controller of the apiiSimFrontofficeApp
 */
angular.module('apiiSimFrontofficeApp').controller('DetailCtrl',
		[ '$scope', '$rootScope', '$log', function($scope, $rootScope, $log) {

			$scope.$on('solution', function(event, index, data) {
				$scope.index = index;
				$scope.data = data;
			});

			$scope.$on('map', function(event, index) {
				$scope.onSelect(index);
			});

			$scope.onSelect = function(index) {
				$scope.selected = index;
				var value = $scope.data.body.PlanTripNotificationResponseType.ComposedTrip.sections[index];
				$rootScope.$broadcast('detail', index, value);
			};

			$scope.getWaiting = function(index) {
				var result = 0;
				var array = $scope.data.body.PlanTripNotificationResponseType.ComposedTrip.sections;

				var current = array[index];
				var next = null;
				if (index + 1 < array.length) {
					next = array[index + 1];
				}

				var arrival = null;
				if (current.Leg) {
					arrival = moment(current.Leg.Arrival.DateTime, 'YYYY-MM-DDTHH:mm:ss');
				} else if (current.PTRide) {
					arrival = moment(current.PTRide.Arrival.DateTime, 'YYYY-MM-DDTHH:mm:ss');
				}

				var departure_next = null;
				if (next) {
					if (next.Leg) {
						departure_next = moment(next.Leg.Departure.DateTime, 'YYYY-MM-DDTHH:mm:ss');
					} else if (next.PTRide) {
						departure_next = moment(next.PTRide.Departure.DateTime, 'YYYY-MM-DDTHH:mm:ss');
					}
					if (arrival && departure_next) {
						result = departure_next.diff(arrival);
					}
				} else {
					result = 0;
				}

				return result;
			};

			$scope.getIconClass = function(key) {
				return Constant.toIconClass(key);
			};

			$scope.getElapsedTime = function(index) {
				var result = 0;

				var array = $scope.data.body.PlanTripNotificationResponseType.ComposedTrip.sections;

				var current = array[index];
				var next = null;
				if (index + 1 < array.length) {
					next = array[index + 1];
				}

				var departure = null;
				var arrival = null;
				if (current.Leg) {
					departure = moment(current.Leg.Departure.DateTime, 'YYYY-MM-DDTHH:mm:ss');
					arrival = moment(current.Leg.Arrival.DateTime, 'YYYY-MM-DDTHH:mm:ss');
				} else if (current.PTRide) {
					departure = moment(current.PTRide.Departure.DateTime, 'YYYY-MM-DDTHH:mm:ss');
					arrival = moment(current.PTRide.Arrival.DateTime, 'YYYY-MM-DDTHH:mm:ss');
				}

				if (next) {
					var departure_next = null;
					if (next.Leg) {
						departure_next = moment(next.Leg.Departure.DateTime, 'YYYY-MM-DDTHH:mm:ss');
					} else if (next.PTRide) {
						departure_next = moment(next.PTRide.Departure.DateTime, 'YYYY-MM-DDTHH:mm:ss');
					}
					if (departure && departure_next) {
						result = departure_next.diff(departure);
					}
				} else {
					result = arrival.diff(departure);
				}

				return result;
			};
		} ]);
