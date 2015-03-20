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
				'$log',
				'Locale',
				'$window',
				'$timeout',
				function($scope, $log, Locale, $window, $timeout) {

					$scope.groups = [ {
						open : true
					}, {
						open : false
					} ];

					$scope.disabled = true;

					Locale.setLocale('fr');

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
						var element = angular.element('#print-detail')[0];
						var html = '<html><head>' + '<link rel="stylesheet" type="text/css" media="print" href="styles/main.css"/>'
								+ '</head><body>' + element.innerHTML + '</body></html>';

						var iframe = document.createElement('iframe');
						document.body.appendChild(iframe);
						iframe.style.visibility = "hidden";
						iframe.style.position = "fixed";
						iframe.style.lef = "0";
						iframe.style.top = "0";
						iframe.style.width = "100%";
						iframe.style.height = "100%";
						iframe.style.background = '#FFFFFF';
						iframe.onload = print;

						iframe.contentDocument.open();
						iframe.contentDocument.write(html);
						iframe.contentDocument.close();
					};

					function close() {
						var iframe = this.__container__;
						$timeout(function() {
							document.body.removeChild(iframe);
						}, 1000);
					}

					function print() {
						this.contentWindow.__container__ = this;
						this.contentWindow.onbeforeunload = close;
						this.contentWindow.onafterprint = close;
						this.contentWindow.focus(); // Required for IE
						this.contentWindow.print();
						if(getBrowserName() == "chrome"){
							document.body.removeChild(this)
						}
					}

					function getBrowserName() {

						var userAgent = $window.navigator.userAgent;
						var browsers = {
							chrome : /chrome/i,
							safari : /safari/i,
							firefox : /firefox/i,
							ie : /internet explorer/i
						};

						for ( var key in browsers) {
							if (browsers[key].test(userAgent)) {
								return key;
							}
						}
						;

						return 'unknown';
					}

					$log.info('[DSU] browser : ' + getBrowserName());
				} ]);
