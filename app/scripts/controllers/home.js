'use strict';

/**
 * @ngdoc function
 * @name apiiSimFrontofficeApp.controller:HomeCtrl
 * @description # HomeCtrl Controller of the apiiSimFrontofficeApp
 */
angular
		.module('apiiSimFrontofficeApp')
		.controller(
				'HomeCtrl',
				[
						'$scope',
						'$log',
						'Locale',
						function($scope, $log, Locale) {

							$scope.groups = [ {
								open : true
							}, {
								open : false
							} ];

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

							$scope.print = function() {
								
								$log.info("[DSU] call print");

//								var DocumentContainer = document.getElementById('toto');
//								var html = '<html><head>'
//										+ '<link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.css" />'
//										+ '<link rel="stylesheet" media="print" href="bower_components/leaflet/dist/leaflet.css"  />'
//										+ '<link rel="stylesheet" media="print" href="bower_components/bootstrap/dist/css/bootstrap.css" />'
//										+ '<link rel="stylesheet" href="styles/main.css"/>'
//										+ '<link rel="stylesheet" href="styles/plantrip.css" />'
//										+ '<link rel="stylesheet" href="styles/fontello.css" />'
//										+ '</head><body style="background:#ffffff;">' + DocumentContainer.innerHTML
//										+ '</body></html>';
//
//								var WindowObject = window.open("", "PrintWindow",
//										"width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
//								WindowObject.document.writeln(html);
//								WindowObject.document.close();
//								WindowObject.focus();
//								WindowObject.print();
//								WindowObject.close();

							};
						} ]);
