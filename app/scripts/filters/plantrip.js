'use strict';

/**
 * @ngdoc filter
 * @name apiiSimFrontofficeApp.filter:plantrip
 * @function
 * @description # plantrip Filter in the apiiSimFrontofficeApp.
 */
angular.module('apiiSimFrontofficeApp').filter('plantripDurationFormat',
		[ 'moment', function(moment) {
			return function(value, format) {
				if (typeof value === 'undefined' || value === null) {
					return '';
				}

				return moment.duration(value).format(format);
			};
		} ]);
