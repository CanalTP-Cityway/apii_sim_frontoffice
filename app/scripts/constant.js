'use strict';

function Constant() {
}

Constant.TRANSPORT_MODE = {
	ALL : [ 'ALL' ],
	BUS : [ 'BUS', 'COACH', 'TROLLEYBUS' ],
	TRAM : [ 'TRAM' ],
	RAIL : [ 'RAIL', 'URBANRAIL', 'INTERCITYRAIL' ],
	METRO : [ 'METRO' ],
	AIR : [ 'AIR' ],
	WATER : [ 'WATER' ],
	CABLE : [ 'CABLE', 'FUNICULAR' ],
	TAXI : [ 'TAXI' ],
	BIKE : [ 'BIKE' ],
	CAR : [ 'CAR' ]
};

Constant.ACCESS_MODE = {
	foot : [ 'foot' ],
	car : [ 'car', 'taxi', 'shuttle', 'boat' ],
	bicycle : [ 'bicycle' ]
};

Constant.toIconClass = function(key) {
	var result = '';
	var mode = Constant.fromTransportMode(key);	
	if(mode){
		result = 'icon-' + mode.toLowerCase();
	}else{
		result = 'icon-' + key.toLowerCase();	
	}
	return result;
};

Constant.toTransportMode = function(key) {
	return Constant.TRANSPORT_MODE[key];
};

Constant.fromTransportMode = function(value) {
	var result = null;

	loop: for ( var key in Constant.TRANSPORT_MODE) {
		var array = Constant.TRANSPORT_MODE[key];
		for (var i = 0; i < array.length; i++) {
			var item = array[i];
			if (item === value) {
				result = key;
				break loop;
			}
		}
	}
	return result;
};

Constant.toAccessMode = function(key) {
	return Constant.ACCESS_MODE[key];
};

Constant.fromAccessMode = function(value) {
	var result = null;

	loop: for ( var key in Constant.ACCESS_MODE) {
		var array = Constant.ACCESS_MODE[key];
		for (var i = 0; i < array.length; i++) {
			var item = array[i];
			if (item === value) {
				result = key;
				break loop;
			}
		}
	}
	return result;
};