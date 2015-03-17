'use strict';
/**
 * @ngdoc service
 * @name apiiSimFrontofficeApp.locale
 * @description # locale Service in the apiiSimFrontofficeApp.
 */
angular.module('apiiSimFrontofficeApp')
		.service('Locale',
				[
						'$locale',
						'gettextCatalog',
						function($locale, gettextCatalog) {

							this.data = {
								'fr' : {
									"DATETIME_FORMATS" : {
										"AMPMS" : [ "AM", "PM" ],
										"DAY" : [ "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi" ],
										"MONTH" : [ "janvier", "f\u00e9vrier", "mars", "avril", "mai", "juin", "juillet",
												"ao\u00fbt", "septembre", "octobre", "novembre", "d\u00e9cembre" ],
										"SHORTDAY" : [ "dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam." ],
										"SHORTMONTH" : [ "janv.", "f\u00e9vr.", "mars", "avr.", "mai", "juin", "juil.",
												"ao\u00fbt", "sept.", "oct.", "nov.", "d\u00e9c." ],
										"fullDate" : "EEEE d MMMM y",
										"longDate" : "d MMMM y",
										"medium" : "d MMM y HH:mm:ss",
										"mediumDate" : "d MMM y",
										"mediumTime" : "HH:mm:ss",
										"short" : "dd/MM/y HH:mm",
										"shortDate" : "dd/MM/y",
										"shortTime" : "HH:mm"
									},
									"NUMBER_FORMATS" : {
										"CURRENCY_SYM" : "\u20ac",
										"DECIMAL_SEP" : ",",
										"GROUP_SEP" : "\u00a0",
										"PATTERNS" : [ {
											"gSize" : 3,
											"lgSize" : 3,
											"maxFrac" : 3,
											"minFrac" : 0,
											"minInt" : 1,
											"negPre" : "-",
											"negSuf" : "",
											"posPre" : "",
											"posSuf" : ""
										}, {
											"gSize" : 3,
											"lgSize" : 3,
											"maxFrac" : 2,
											"minFrac" : 2,
											"minInt" : 1,
											"negPre" : "-",
											"negSuf" : "\u00a0\u00a4",
											"posPre" : "",
											"posSuf" : "\u00a0\u00a4"
										} ]
									},
									"id" : "fr"
								},
								'en' : {
									"DATETIME_FORMATS" : {
										"AMPMS" : [ "AM", "PM" ],
										"DAY" : [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
										"MONTH" : [ "January", "February", "March", "April", "May", "June", "July", "August",
												"September", "October", "November", "December" ],
										"SHORTDAY" : [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
										"SHORTMONTH" : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct",
												"Nov", "Dec" ],
										"fullDate" : "EEEE, MMMM d, y",
										"longDate" : "MMMM d, y",
										"medium" : "MMM d, y h:mm:ss a",
										"mediumDate" : "MMM d, y",
										"mediumTime" : "h:mm:ss a",
										"short" : "M/d/yy h:mm a",
										"shortDate" : "M/d/yy",
										"shortTime" : "h:mm a"
									},
									"NUMBER_FORMATS" : {
										"CURRENCY_SYM" : "$",
										"DECIMAL_SEP" : ".",
										"GROUP_SEP" : ",",
										"PATTERNS" : [ {
											"gSize" : 3,
											"lgSize" : 3,
											"maxFrac" : 3,
											"minFrac" : 0,
											"minInt" : 1,
											"negPre" : "-",
											"negSuf" : "",
											"posPre" : "",
											"posSuf" : ""
										}, {
											"gSize" : 3,
											"lgSize" : 3,
											"maxFrac" : 2,
											"minFrac" : 2,
											"minInt" : 1,
											"negPre" : "\u00a4-",
											"negSuf" : "",
											"posPre" : "\u00a4",
											"posSuf" : ""
										} ]
									},
									"id" : "en"
								}
							};

							this.setLocale = function(language) {
								$locale.DATETIME_FORMATS = this.data[language].DATETIME_FORMATS;
								$locale.NUMBER_FORMATS = this.data[language].NUMBER_FORMATS;
								$locale.id = this.data[language].id;
								
								gettextCatalog.setCurrentLanguage(language);
								gettextCatalog.debug = true;
							}							
							
							this.getLocale = function() {							
								return $locale.id;								
							}

						} ]);
