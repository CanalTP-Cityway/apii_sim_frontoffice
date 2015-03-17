'use strict';
/**
 * @ngdoc service
 * @name apiiSimFrontofficeApp.sim
 * @description # sim Service in the apiiSimFrontofficeApp.
 */
angular
		.module('apiiSimFrontofficeApp')
		.service(
				'Sim',
				[
						'$rootScope',
						'$location',
						'$q',
						'$log',
						'$timeout',
						function($rootScope, $location, $q, $log, $timeout) {
							var DEFAULT = {
								departure : {
									lng : 0,
									lat : 0
								},
								arrival : {
									lng : 0,
									lat : 0
								},
								plantrip : {
									request : null,
									response : null
								},
								responses : {
									starting : null,
									entries : [],
									ending : null
								},
								cancelation : {
									request : null,
									response : null
								}
							};

							$rootScope.model = DEFAULT;
							this.context = new Action_sm(this);
							this.context.enterStartState();
							this.socket = null;
							this.deferred = null;
							this.url = null;
							this.timer = null;

							this.clear = function() {
								$rootScope.model.plantrip.request = null;
								$rootScope.model.plantrip.response = null;
								$rootScope.model.responses.starting = null;
								$rootScope.model.responses.entries = [];
								$rootScope.model.responses.ending = null;
								$rootScope.model.cancelation.request = null;
								$rootScope.model.cancelation.response = null;
							};

							this.send = function(value) {
								var self = this;
								self.clear();

//								this.url = 'ws://' + $location.host() + ':'
//										+ $location.port() + '/planner';
								this.url = 'wss://' + $location.host() + '/planner';
								
								// TODO
								this.url = "wss://www.apii-sim.fr/planner"
								//this.url = "wss://apiisim-mtm.cityway.fr/planner"
										
								this.deferred = $q.defer();
								this.deferred.promise.then(function() {
									self.request(value);
								});
								if (this.socket == null
										|| this.socket.readyState == 3) {
									this.open(this.url);
								} else {
									if (this.deferred !== null) {
										this.deferred.resolve(0);
									}
								}
							};

							this.open = function(url) {
								this.context.open(url);
							};

							this.close = function() {
								$log.info('[DSU] call close()');
								this.context.close();
							};

							this.request = function(value) {
								this.context.request(value);
							};

							this.cancellation = function(value) {
								this.context.cancellation(value);
							};

							this.opening = function(value) {
								this.socket = new WebSocket(value);
								var self = this;

								this.socket.onopen = function() {
									$log.info('[DSU] call onopen()');
									self.context.onOpen();
									$rootScope.$apply(function() {
										if (self.deferred !== null) {
											self.deferred.resolve(0);
										}
									});
								};

								this.socket.onclose = function() {
									$log.info('[DSU] call onclose()');
									self.context.onClose();
									$rootScope.$apply(function() {
										if (self.deferred !== null) {
											self.deferred.reject(1);
											self.deferred = null;
										}
									});
								};

								this.socket.onerror = function() {
									$log.info('[DSU] call onerror()');
									self.context.onError();
									$rootScope.$apply(function() {
										if (self.deferred !== null) {
											self.deferred.reject(1);
											self.deferred = null;
										}
									});
								};

								this.socket.onmessage = function(message) {
									$rootScope
											.$apply(function() {
												var value = JSON
														.parse(message.data);
												$log
														.info('[DSU] receive : '
																+ JSON
																		.stringify(value));
												var type = Object.keys(value)[0];
												switch (type) {
												case 'PlanTripResponse':
													if (value.PlanTripResponse.Status == 0) {
														self.context
																.onPlanTripResponseValid(value);
													} else {
														self.context
																.onPlanTripResponseInvalid(value);
													}
													true
													break;
												case 'AbstractResponseType':
													self.context
															.onPlanTripCancellationResponse(value);
													break;
												case 'StartingSearch':
													self.context
															.onStartingSearch(value);
													break;
												case 'PlanTripExistenceNotificationResponseType':
													self.context
															.onPlanTripExistenceNotificationResponse(value);
													break;
												case 'PlanTripNotificationResponseType':
													self.context
															.onPlanTripNotificationResponse(value);
													break;
												case 'EndingSearch':
													self.context
															.onEndingSearch(value);
													break;
												default:
													break;
												}
											});
								};

							};

							this.closing = function() {
								$log.info('[DSU] call closing()');
								if (this.socket != null) {
									this.socket.close();
									this.socket = null;
								}
							};

							this.sendPlanTripRequest = function(value) {
								$rootScope.model.plantrip.request = value;
								if (this.socket !== null) {
									$log.warn('[DSU] send to ' + this.url
											+ ' message : '
											+ JSON.stringify(value));
									this.socket.send(JSON.stringify(value));
								}
							};

							this.entryPlanTripResponse = function() {
								var self = this;
								if (this.timer) {
									cancel(this.timer);
									this.timer = null;
								}
								this.timer = $timeout(function() {
									self.close();
								}, 3000);
							};

							this.exitPlanTripResponse = function() {
								if (this.timer) {
									$timeout.cancel(this.timer);
									this.timer = null;
								}
							};

							this.receivePlanTripResponseValid = function(value) {
								$rootScope.model.plantrip.response = value;
							};

							this.receivePlanTripResponseInvalid = function(
									value) {
								$rootScope.model.plantrip.response = value;
							};

							this.sendPlanTripCancellationRequest = function(
									value) {
								$rootScope.model.cancelation.request = value;
								if (this.socket !== null) {
									$log.warn('[DSU] send to ' + this.url
											+ ' message : '
											+ JSON.stringify(value));
									this.socket.send(JSON.stringify(value));
								}
							};

							this.entryPlanTripCancellation = function() {
								var self = this;
								if (this.timer) {
									cancel(this.timer);
									this.timer = null;
								}
								this.timer = $timeout(function() {
									self.close();
								}, 3000);
							};

							this.exitPlanTripCancellation = function() {
								if (this.timer) {
									$timeout.cancel(this.timer);
									this.timer = null;
								}
							};

							this.receivePlanTripCancellationResponse = function(
									value) {
								$rootScope.model.cancelation.response = value;
							};

							this.receiveStartingSearch = function(value) {
								$rootScope.model.responses.starting = value;
							};

							this.receivePlanTripExistenceNotificationResponse = function(
									value) {
								var entry = {
									header : value,
									body : null
								};					
								$rootScope.model.responses.entries.push(entry);
							};

							this.receivePlanTripNotificationResponse = function(
									value) {
								var array = $rootScope.model.responses.entries;
								for (var i = 0; i < array.length; i++) {
									var id = array[i].header.PlanTripExistenceNotificationResponseType.ComposedTripId;
									if (value.PlanTripNotificationResponseType.ComposedTrip.id == id) {
										array[i].body = value;
										break;
									}
								}
							};

							this.receiveEndingSearch = function(value) {
								$rootScope.model.responses.ending = value;		
								
								var array = $rootScope.model.responses.entries;
								var i = array.length;
								while (i--) {
									if (array[i].body == null) {
										array.splice(i,1);										
									}
								}												
							};

						} ]);
