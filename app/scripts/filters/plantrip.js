'use strict';

/**
 * @ngdoc filter
 * @name plantripApp.filter:plantrip
 * @function
 * @description # plantrip Filter in the plantripApp.
 */
angular.module('plantripApp').filter('plantripDurationFormat',
		[ 'moment', function(moment) {
			return function(value, format) {
				if (typeof value === 'undefined' || value === null) {
					return '';
				}

				return moment.duration(value).format(format);
			};
		} ]);
