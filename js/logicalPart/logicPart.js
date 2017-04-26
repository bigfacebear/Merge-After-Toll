// updateParameters();

// window.setInterval(updateCarPos, TIMEINTERVAL * 1000);

// // window.setTimeout("delayRandom("+1+")", 1000);

// for (var i = 0; i < L; i++) {
// 	window.setInterval("delayRandom("+i+")", SAFEINTERNAL * 1000);
// }
// // window.setInterval("delayRandom(0)", SAFEINTERNAL*500);

// window.setInterval(function(){
// 	_time += 1;
// 	document.getElementById("time").innerHTML=_time;
// }, 1000 / TIMERATE);

function logicalPart(paras) {
	updateParameters(paras);

	timers.push(window.setInterval(updateCarPos, TIMEINTERVAL * 1000));

	// window.setTimeout("delayRandom("+1+")", 1000);

	for (var i = 0; i < L; i++) {
		timers.push(window.setInterval("delayRandom("+i+")", SAFEINTERNAL * 1000));
	}
	// window.setInterval("delayRandom(0)", SAFEINTERNAL*500);

	timers.push(window.setInterval(function(){
		_time += 1;
		if (_time % 60 === 0) {
			_cost += COST;
			document.getElementById("cost").innerHTML=_cost;
		}
		_cntEnterBuffer += _enterBuffer;
		_cntLeaveBuffer += _leaveBuffer;
		document.getElementById("time").innerHTML=_time;
		document.getElementById("enterbuf").innerHTML = round2(_cntEnterBuffer / _time);
		document.getElementById("leavebuf").innerHTML = round2(_cntLeaveBuffer / _time);
		if (_time === 0) {
			sysVarClear();
		}
	}, 1000 / TIMERATE));

	var clearTimer = window.setInterval(sysVarClear, 1);
	window.setTimeout(function(){window.clearInterval(clearTimer);}, INITTIME*1000);
}

function deleteTimers() {
	for (var i = 0; i < timers.length; i++) {
		window.clearInterval(timers[i]);
	}
}

function sysVarClear() {
	// _time = 0;
	_consumedTime = 0;
	_meanConsumedTime = 0;
	_cntEnter = 0;
	_cntPass = 0;
	_cntLeave = 0;
	_income = 0;
	_cost = 0;
	_enterBuffer = 0;
	_leaveBuffer = 0;
}