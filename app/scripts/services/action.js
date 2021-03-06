'use strict';

function ActionState(name, id) {
	State.apply(this, arguments);
}

ActionState.prototype = State.mixin(new State(), {
	Entry : function(fsm) {

	},
	Exit_ : function(fsm) {

	},
	cancellation : function(fsm, value) {
		this.Default_(fsm);
	},
	close : function(fsm) {
		this.Default_(fsm);
	},
	onClose : function(fsm) {
		this.Default_(fsm);
	},
	onEndingSearch : function(fsm, value) {
		this.Default_(fsm);
	},
	onError : function(fsm) {
		this.Default_(fsm);
	},
	onOpen : function(fsm) {
		this.Default_(fsm);
	},
	onPlanTripCancellationResponse : function(fsm, value) {
		this.Default_(fsm);
	},
	onPlanTripExistenceNotificationResponse : function(fsm, value) {
		this.Default_(fsm);
	},
	onPlanTripNotificationResponse : function(fsm, value) {
		this.Default_(fsm);
	},
	onPlanTripResponseInvalid : function(fsm, value) {
		this.Default_(fsm);
	},
	onPlanTripResponseValid : function(fsm, value) {
		this.Default_(fsm);
	},
	onStartingSearch : function(fsm, value) {
		this.Default_(fsm);
	},
	open : function(fsm, value) {
		this.Default_(fsm);
	},
	request : function(fsm, value) {
		this.Default_(fsm);
	},
	Default_ : function(fsm) {

	}

});
function MainMap_Default() {
	ActionState.apply(this, arguments);

}

MainMap_Default.prototype = State.mixin(new ActionState(), {
	open : function(fsm, value) {

	},
	close : function(fsm) {
		var ctxt = fsm.getOwner();
		fsm.getState().Exit_(fsm);
		fsm.clearState();
		var exception = null;
		try {
			ctxt.closing();
		} catch (exception) {
		}
		fsm.setState(MainMap.Disconnected);
		fsm.getState().Entry(fsm);
		if (exception) {
			throw exception;
		}
	},
	onOpen : function(fsm) {

	},
	onClose : function(fsm) {
		var ctxt = fsm.getOwner();
		fsm.getState().Exit_(fsm);
		fsm.clearState();
		var exception = null;
		try {
			ctxt.closing();
		} catch (exception) {
		}
		fsm.setState(MainMap.Disconnected);
		fsm.getState().Entry(fsm);
		if (exception) {
			throw exception;
		}
	},
	onError : function(fsm) {
		var ctxt = fsm.getOwner();
		fsm.getState().Exit_(fsm);
		fsm.clearState();
		var exception = null;
		try {
			ctxt.closing();
		} catch (exception) {
		}
		fsm.setState(MainMap.Disconnected);
		fsm.getState().Entry(fsm);
		if (exception) {
			throw exception;
		}
	},
	request : function(fsm, value) {

	},
	cancellation : function(fsm, value) {

	},
	onPlanTripResponseValid : function(fsm, value) {

	},
	onPlanTripResponseInvalid : function(fsm, value) {

	},
	onPlanTripCancellationResponse : function(fsm, value) {

	},
	onStartingSearch : function(fsm, value) {

	},
	onPlanTripExistenceNotificationResponse : function(fsm, value) {

	},
	onPlanTripNotificationResponse : function(fsm, value) {

	},
	onEndingSearch : function(fsm, value) {

	}

});
function MainMap_Disconnected() {
	MainMap_Default.apply(this, arguments);

}

MainMap_Disconnected.prototype = State.mixin(new MainMap_Default(), {
	open : function(fsm, value) {
		var ctxt = fsm.getOwner();
		fsm.getState().Exit_(fsm);
		fsm.clearState();
		var exception = null;
		try {
			ctxt.opening(value);
		} catch (exception) {
		}
		fsm.setState(MainMap.Connecting);
		fsm.getState().Entry(fsm);
		if (exception) {
			throw exception;
		}
	}

});
function MainMap_Connecting() {
	MainMap_Default.apply(this, arguments);

}

MainMap_Connecting.prototype = State.mixin(new MainMap_Default(), {
	onOpen : function(fsm) {
		fsm.getState().Exit_(fsm);
		fsm.setState(MainMap.Connected);
		fsm.getState().Entry(fsm);
		fsm.pushState(PlanTripMap.PlanTripRequest);
		fsm.getState().Entry(fsm);
	}

});
function MainMap_Connected() {
	MainMap_Default.apply(this, arguments);

}

MainMap_Connected.prototype = State.mixin(new MainMap_Default(), {
	close : function(fsm) {
		var ctxt = fsm.getOwner();
		fsm.getState().Exit_(fsm);
		fsm.clearState();
		var exception = null;
		try {
			ctxt.closing();
		} catch (exception) {
		}
		fsm.setState(MainMap.Disconnected);
		fsm.getState().Entry(fsm);
		if (exception) {
			throw exception;
		}
	},
	onClose : function(fsm) {
		fsm.getState().Exit_(fsm);
		fsm.setState(MainMap.Disconnected);
		fsm.getState().Entry(fsm);
	},
	onError : function(fsm) {
		fsm.getState().Exit_(fsm);
		fsm.setState(MainMap.Disconnected);
		fsm.getState().Entry(fsm);
	}

});
function MainMap_Disconnecting() {
	MainMap_Default.apply(this, arguments);

}

MainMap_Disconnecting.prototype = State.mixin(new MainMap_Default(), {
	onClose : function(fsm) {
		fsm.getState().Exit_(fsm);
		fsm.setState(MainMap.Disconnected);
		fsm.getState().Entry(fsm);
	}

});
function MainMap() {

}

MainMap.prototype = State.mixin({}, {

});
MainMap.Default_ = new MainMap_Default('MainMap.Default_', -1);
;
MainMap.Connected = new MainMap_Connected('MainMap.Connected', 2);
;
MainMap.Disconnecting = new MainMap_Disconnecting('MainMap.Disconnecting', 3);
;
MainMap.Disconnected = new MainMap_Disconnected('MainMap.Disconnected', 0);
;
MainMap.Connecting = new MainMap_Connecting('MainMap.Connecting', 1);
;
function PlanTripMap_Default() {
	ActionState.apply(this, arguments);

}

PlanTripMap_Default.prototype = State.mixin(new ActionState(), {
	open : function(fsm, value) {

	},
	close : function(fsm) {
		fsm.getState().Exit_(fsm);
		fsm.popState();
		fsm.close();
	},
	onOpen : function(fsm) {

	},
	onClose : function(fsm) {
		fsm.getState().Exit_(fsm);
		fsm.popState();
		fsm.onClose();
	},
	onError : function(fsm) {
		fsm.getState().Exit_(fsm);
		fsm.popState();
		fsm.onError();
	},
	request : function(fsm, value) {

	},
	cancellation : function(fsm, value) {

	},
	onPlanTripResponseValid : function(fsm, value) {

	},
	onPlanTripResponseInvalid : function(fsm, value) {

	},
	onPlanTripCancellationResponse : function(fsm, value) {

	},
	onStartingSearch : function(fsm, value) {

	},
	onPlanTripExistenceNotificationResponse : function(fsm, value) {

	},
	onPlanTripNotificationResponse : function(fsm, value) {

	},
	onEndingSearch : function(fsm, value) {

	}

});
function PlanTripMap_PlanTripRequest() {
	PlanTripMap_Default.apply(this, arguments);

}

PlanTripMap_PlanTripRequest.prototype = State.mixin(new PlanTripMap_Default(), {
	request : function(fsm, value) {
		var ctxt = fsm.getOwner();
		fsm.getState().Exit_(fsm);
		fsm.clearState();
		var exception = null;
		try {
			ctxt.sendPlanTripRequest(value);
		} catch (exception) {
		}
		fsm.setState(PlanTripMap.PlanTripResponse);
		fsm.getState().Entry(fsm);
		if (exception) {
			throw exception;
		}
	}

});
function PlanTripMap_PlanTripResponse() {
	PlanTripMap_Default.apply(this, arguments);

}

PlanTripMap_PlanTripResponse.prototype = State.mixin(new PlanTripMap_Default(), {
	Entry : function(fsm) {
		var ctxt = fsm.getOwner();
		ctxt.entryPlanTripResponse();
	},
	Exit_ : function(fsm) {
		var ctxt = fsm.getOwner();
		ctxt.exitPlanTripResponse();
	},
	onPlanTripResponseInvalid : function(fsm, value) {
		var ctxt = fsm.getOwner();
		fsm.getState().Exit_(fsm);
		fsm.clearState();
		var exception = null;
		try {
			ctxt.receivePlanTripResponseInvalid(value);
		} catch (exception) {
		}
		fsm.setState(PlanTripMap.PlanTripRequest);
		fsm.getState().Entry(fsm);
		if (exception) {
			throw exception;
		}
	},
	onPlanTripResponseValid : function(fsm, value) {
		var ctxt = fsm.getOwner();
		fsm.getState().Exit_(fsm);
		fsm.clearState();
		var exception = null;
		try {
			ctxt.receivePlanTripResponseValid(value);
		} catch (exception) {
		}
		fsm.setState(PlanTripMap.PlanTripNotification);
		fsm.getState().Entry(fsm);
		if (exception) {
			throw exception;
		}
	}

});
function PlanTripMap_PlanTripNotification() {
	PlanTripMap_Default.apply(this, arguments);

}

PlanTripMap_PlanTripNotification.prototype = State.mixin(new PlanTripMap_Default(), {
	cancellation : function(fsm, value) {
		var ctxt = fsm.getOwner();
		fsm.getState().Exit_(fsm);
		fsm.clearState();
		var exception = null;
		try {
			ctxt.sendPlanTripCancellationRequest(value);
		} catch (exception) {
		}
		fsm.setState(PlanTripMap.PlanTripCancellation);
		fsm.getState().Entry(fsm);
		if (exception) {
			throw exception;
		}
	},
	onEndingSearch : function(fsm, value) {
		var ctxt = fsm.getOwner();
		fsm.getState().Exit_(fsm);
		fsm.clearState();
		var exception = null;
		try {
			ctxt.receiveEndingSearch(value);
		} catch (exception) {
		}
		fsm.setState(PlanTripMap.PlanTripRequest);
		fsm.getState().Entry(fsm);
		if (exception) {
			throw exception;
		}
	},
	onPlanTripExistenceNotificationResponse : function(fsm, value) {
		var ctxt = fsm.getOwner();
		var endState = fsm.getState();
		fsm.clearState();
		var exception = null;
		try {
			ctxt.receivePlanTripExistenceNotificationResponse(value);
		} catch (exception) {
		}
		fsm.setState(endState);
		if (exception) {
			throw exception;
		}
	},
	onPlanTripNotificationResponse : function(fsm, value) {
		var ctxt = fsm.getOwner();
		var endState = fsm.getState();
		fsm.clearState();
		var exception = null;
		try {
			ctxt.receivePlanTripNotificationResponse(value);
		} catch (exception) {
		}
		fsm.setState(endState);
		if (exception) {
			throw exception;
		}
	},
	onStartingSearch : function(fsm, value) {
		var ctxt = fsm.getOwner();
		var endState = fsm.getState();
		fsm.clearState();
		var exception = null;
		try {
			ctxt.receiveStartingSearch(value);
		} catch (exception) {
		}
		fsm.setState(endState);
		if (exception) {
			throw exception;
		}
	}

});
function PlanTripMap_PlanTripCancellation() {
	PlanTripMap_Default.apply(this, arguments);

}

PlanTripMap_PlanTripCancellation.prototype = State.mixin(new PlanTripMap_Default(), {
	Entry : function(fsm) {
		var ctxt = fsm.getOwner();
		ctxt.entryPlanTripCancellation();
	},
	Exit_ : function(fsm) {
		var ctxt = fsm.getOwner();
		ctxt.exitPlanTripCancellation();
	},
	onEndingSearch : function(fsm, value) {
		var ctxt = fsm.getOwner();
		fsm.getState().Exit_(fsm);
		fsm.clearState();
		var exception = null;
		try {
			ctxt.receiveEndingSearch(value);
		} catch (exception) {
		}
		fsm.setState(PlanTripMap.PlanTripRequest);
		fsm.getState().Entry(fsm);
		if (exception) {
			throw exception;
		}
	},
	onPlanTripCancellationResponse : function(fsm, value) {
		var ctxt = fsm.getOwner();
		fsm.getState().Exit_(fsm);
		fsm.clearState();
		var exception = null;
		try {
			ctxt.receivePlanTripCancellationResponse(value);
		} catch (exception) {
		}
		fsm.setState(PlanTripMap.PlanTripRequest);
		fsm.getState().Entry(fsm);
		if (exception) {
			throw exception;
		}
	}

});
function PlanTripMap() {

}

PlanTripMap.prototype = State.mixin({}, {

});
PlanTripMap.Default_ = new PlanTripMap_Default('PlanTripMap.Default_', -1);
;
PlanTripMap.PlanTripResponse = new PlanTripMap_PlanTripResponse('PlanTripMap.PlanTripResponse', 5);
;
PlanTripMap.PlanTripCancellation = new PlanTripMap_PlanTripCancellation('PlanTripMap.PlanTripCancellation', 7);
;
PlanTripMap.PlanTripRequest = new PlanTripMap_PlanTripRequest('PlanTripMap.PlanTripRequest', 4);
;
PlanTripMap.PlanTripNotification = new PlanTripMap_PlanTripNotification('PlanTripMap.PlanTripNotification', 6);
;
function Action_sm(owner) {
	FSMContext.apply(this, arguments);
	this.setState(MainMap.Disconnected);
	this._owner = owner;
}

Action_sm.prototype = State.mixin(new FSMContext(), {
	cancellation : function(value) {
		this._transition = "cancellation";
		this.getState().cancellation(this, value);
		this._transition = null;
	},
	close : function() {
		this._transition = "close";
		this.getState().close(this);
		this._transition = null;
	},
	onClose : function() {
		this._transition = "onClose";
		this.getState().onClose(this);
		this._transition = null;
	},
	onEndingSearch : function(value) {
		this._transition = "onEndingSearch";
		this.getState().onEndingSearch(this, value);
		this._transition = null;
	},
	onError : function() {
		this._transition = "onError";
		this.getState().onError(this);
		this._transition = null;
	},
	onOpen : function() {
		this._transition = "onOpen";
		this.getState().onOpen(this);
		this._transition = null;
	},
	onPlanTripCancellationResponse : function(value) {
		this._transition = "onPlanTripCancellationResponse";
		this.getState().onPlanTripCancellationResponse(this, value);
		this._transition = null;
	},
	onPlanTripExistenceNotificationResponse : function(value) {
		this._transition = "onPlanTripExistenceNotificationResponse";
		this.getState().onPlanTripExistenceNotificationResponse(this, value);
		this._transition = null;
	},
	onPlanTripNotificationResponse : function(value) {
		this._transition = "onPlanTripNotificationResponse";
		this.getState().onPlanTripNotificationResponse(this, value);
		this._transition = null;
	},
	onPlanTripResponseInvalid : function(value) {
		this._transition = "onPlanTripResponseInvalid";
		this.getState().onPlanTripResponseInvalid(this, value);
		this._transition = null;
	},
	onPlanTripResponseValid : function(value) {
		this._transition = "onPlanTripResponseValid";
		this.getState().onPlanTripResponseValid(this, value);
		this._transition = null;
	},
	onStartingSearch : function(value) {
		this._transition = "onStartingSearch";
		this.getState().onStartingSearch(this, value);
		this._transition = null;
	},
	open : function(value) {
		this._transition = "open";
		this.getState().open(this, value);
		this._transition = null;
	},
	request : function(value) {
		this._transition = "request";
		this.getState().request(this, value);
		this._transition = null;
	},
	getState : function() {
		if (this._state == null) {
			throw new StateUndefinedException();
		}
		return this._state;
	},
	enterStartState : function() {
		this._state.Entry(this);
	},
	getOwner : function() {
		return this._owner;
	}

});
