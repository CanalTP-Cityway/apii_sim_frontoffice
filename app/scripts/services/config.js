'use strict';
/**
 * @ngdoc service
 * @name apiiSimFrontofficeApp.config
 * @description # config Service in the apiiSimFrontofficeApp.
 */
angular.module('apiiSimFrontofficeApp').service('Config', [ '$q', '$http', function($q, $http) {

	this.data = null;

	this.getConfig = function() {
		var deferred = $q.defer();

		if (this.config != null) {
			deferred.resolve(this.data);
		} else {
			$http.get("config.json").success(function(data, status, headers, config) {
				deferred.resolve(data);
			}).error(function(data, status, headers, config) {
				deferred.reject(status);
			});
		}

		return deferred.promise;
	}

} ]);
