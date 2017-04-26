var realL0, realL1, realL2, realL3;
var L, B;
var mod;
var shape;
var R;
var m;

// waiting time for pass
var WAIT_BIG = 6;//s
var WAIT_SMALL = 3;//s
var DENSITY = 2;//s
var INCOME = 3;//$/car
var COST = 2;//$/min
var TIMERATE = 1;

var L2B = [];
var B2L = [];

var runQueues = [];
var enterQueues = [];
var leaveQueues = [];

var tmpQueue = [];
var waitQueue = [];

var timers = [];

var _time = 0;
var _consumedTime = 0;
var _meanConsumedTime = 0;
var _cntEnter = 0;
var _cntPass = 0;
var _cntLeave = 0;
var _income = 0;
var _cost = 0;
var _enterBuffer = 0;
var _leaveBuffer = 0;

var _cntEnterBuffer = 0;
var _cntLeaveBuffer = 0;

var enterArea = 0;
var leaveArea = 0;
// var enterCntMax;
// var leaveCntMax;
// var idealConsumeTime;


function initQueues() {
	for (var i = 0; i < L; i++) {
		runQueues[i] = [];

		enterQueues[i] = [];
		var x1 = realL0;
		var y1 = ROADWIDTH * L / 2 - ROADWIDTH / 2 - i * ROADWIDTH;
		for (var j = 0; j < L2B[i].length; j++) {
			var x2 = realL0 + realL1;
			var y2 = ROADWIDTH * B / 2 - ROADWIDTH / 2 - L2B[i][j] * ROADWIDTH;
			enterQueues[i].push(Path.createNew(i,L2B[i][j],j,x1,y1,x2,y2));
		}

		leaveQueues[i] = LeavePaths.createNew(i);
		for (var j = 0; j < L2B[i].length; j++) {
			leaveQueues[i].paths.push(LeavePath.createNew(L2B[i][j],i));
		}
		leaveQueues[i].genDistMax();
	}
} 

function reloadConsts() {
	ROADWIDTH = 5.7;//m

	SAFEDIST = 3;//m
	// var MAXSPEED = 12;//m/s

	BIG_RATE = 1/4;  // bigCarNumber : (bigCarNumber+smallCarNumber)

	// length of cars
	LEN_BIG = 8;//m
	LEN_SMALL = 4;//m
	CAR_WIDTH = 2;//m
	// accelaration
	A_BIG = 2;//m/s^2
	A_SMALL = 3;//m/s^2
	// the max speed
	MAXSPEED = 12;//m/s
	// flow control
	SAFEINTERNAL = 3;//s
	// delta time
	TIMEINTERVAL = 0.02;//s

	INITTIME = 15;//s

}

function updateParameters(paras) {
	// if (paras) {

		realL0 = paras.realL0;
		realL1 = paras.realL1;
		realL2 = paras.realL2;
		realL3 = paras.realL3;
		L = paras.L;
		B = paras.B;
		shape = paras.shape;
		mod = paras.mod;
		R = paras.R;
		m = paras.m;

		WAIT_BIG = paras.WAIT_BIG;
		WAIT_SMALL = paras.WAIT_SMALL;
		DENSITY = paras.DENSITY;
		TIMERATE = paras.TIMERATE;
		INCOME = paras.INCOME;
		COST = paras.COST;

		reloadConsts();
	// } else {
	// 	realL0 = 20;
	// 	realL1 = parseInt(document.getElementById("l1").value);
	// 	realL2 = parseInt(document.getElementById("l2").value);
	// 	realL3 = parseInt(document.getElementById("l3").value);
	// 	L = parseInt(document.getElementById("l").value);
	// 	B = parseInt(document.getElementById("b").value);
	// 	mod = document.getElementById("mod").value;
	// 	shape = document.getElementById("shape").value;
	// 	R = parseInt(document.getElementById("r").value);
	// 	m = parseInt(document.getElementById("m").value);
	// 	if (isNaN(realL1)) realL1 = 100;
	// 	if (isNaN(realL2)) realL2 = 100;
	// 	if (isNaN(realL3)) realL3 = 100;
	// 	if (isNaN(L)) L = 3;
	// 	if (isNaN(B)) B = 8;
	// 	if (isNaN(R)) R = 50;
	// 	if (isNaN(m)) m = 10;
	// }

	if (realL0 < m) realL0 = m;

	L2B = getPathMap(L,B).L2B;
	B2L = getPathMap(L,B).B2L;

	initQueues();

	SAFEINTERNAL /= TIMERATE;
	DENSITY /= TIMERATE;
	MAXSPEED *= TIMERATE;
	A_BIG *= TIMERATE*TIMERATE;
	A_SMALL *= TIMERATE*TIMERATE;
	WAIT_BIG /= TIMERATE;
	WAIT_SMALL /= TIMERATE;
	// TIMEINTERVAL /= TIMERATE;

	enterArea = (L*ROADWIDTH + B*ROADWIDTH) * realL1 / 2;
	leaveArea = (L*ROADWIDTH + B*ROADWIDTH) * realL3 / 2;
	// enterCntMax = enterArea / (CAR_WIDTH * (LEN_BIG * BIG_RATE+(LEN_SMALL * (1-BIG_RATE)))) * 3 / 4;
	// leaveCntMax = leaveArea / (CAR_WIDTH * (LEN_BIG * BIG_RATE+(LEN_SMALL * (1-BIG_RATE)))) * 3 / 4;

	// idealConsumeTime = calIdealConsumeTime();

	_time = -INITTIME*TIMERATE;
	_consumedTime = 0;
	_meanConsumedTime = 0;
	_cntEnter = 0;
	_cntPass = 0;
	_cntLeave = 0;
	_income = 0;
	_cost = 0;
	_enterBuffer = 0;
	_leaveBuffer = 0;

	_cntEnterBuffer = 0;
	_cntLeaveBuffer = 0;

}

// function calIdealConsumeTime() {
// 	var dist = 0;
// 	for (var i = 0; i < L; i++) {
// 		var paths = enterQueues[i];
// 		for (var j = 0; j < paths.length; j++) {
// 			var path = paths[j];
// 			dist += path.len;
// 		}
// 		paths = leaveQueues[i].paths;
// 		for (var j = 0; j < paths.length; j++) {
// 			var path = paths[j];
// 			dist += path.len;
// 		}
// 	}
// 	dist += B * realL2;
// 	dist /= B;
// 	var time = (dist-(SAFEINTERNAL*MAXSPEED*2)) / MAXSPEED * TIMERATE + 4*SAFEINTERNAL*TIMERATE;
// 	time += (WAIT_BIG * BIG_RATE + WAIT_SMALL * (1-BIG_RATE))*TIMERATE;
// 	return time;
// }
