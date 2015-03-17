'use strict';

/**
 * @ngdoc overview
 * @name apiiSimFrontofficeApp
 * @description # apiiSimFrontofficeApp Main module of the application.
 */
angular.module(
		'apiiSimFrontofficeApp',
		[ 'ngAnimate', 'ngCookies', 'ngResource', 'ngSanitize', 'ngTouch', 'ngLocale', 'gettext', 'ui.router', 'angularMoment',
				'ngStorage', 'ui.bootstrap', 'leaflet-directive' ]).config(

function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/home');

	$stateProvider.state('home', {
		url : '/home',
		views : {
			'' : {
				templateUrl : 'views/home.html'
			},
			'viewA@home' : {
				templateUrl : 'views/plantrip.html',
				controller : 'PlantripCtrl'
			},
			'viewB@home' : {
				templateUrl : 'views/solution.html',
				controller : 'SolutionCtrl'
			},
			'viewC@home' : {
				templateUrl : 'views/map.html',
				controller : 'MapCtrl'
			},
			'viewD@home' : {
				templateUrl : 'views/detail.html',
				controller : 'DetailCtrl'
			},
			'viewE@home' : {
				templateUrl : 'views/header.html'
			}
		}
	});
});