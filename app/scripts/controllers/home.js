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
				function($scope, $log, Locale, $window) {

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
						// print();
						printPage();
					};

					function closePrint() {
						document.body.removeChild(this.__container__);
					}

					function setPrint() {
						this.contentWindow.__container__ = this;
						this.contentWindow.onbeforeunload = closePrint;
						this.contentWindow.onafterprint = closePrint;
						this.contentWindow.focus(); // Required for IE
						this.contentWindow.print();
					}

					function printPage() {
						var element = angular.element('#print-detail')[0];
						var html = '<html><head>'
								+ '<link rel="stylesheet" type="text/css" media="print" href="styles/print.css"/>'
								+ '</head><body>' + element.innerHTML + '</body></html>';
						
						var iframe = document.createElement('iframe');
						document.body.appendChild(iframe);

						iframe.style.visibility = "hidden";
						iframe.style.position = "fixed";
						iframe.style.right = "0";
						iframe.style.bottom = "0";					
						iframe.contentWindow.document.open();
						iframe.contentWindow.document.write(html);
						iframe.contentWindow.document.close();
						
						iframe.onload = setPrint;

	
					}

					function print() {
						var element = angular.element('#print-detail')[0];
						var html = '<html><head>'
								+ '<link rel="stylesheet" type="text/css" media="print" href="styles/print.css"/>'
								+ '</head><body  onafterprint="self.close()" onload="window.print()">' + element.innerHTML
								+ '</body></html>';

						var printer = $window.open("", "print", "status=1,width=800,height=600");
						printer.document.writeln(html);
						printer.document.close();
						printer.focus();
					}

				} ]);
