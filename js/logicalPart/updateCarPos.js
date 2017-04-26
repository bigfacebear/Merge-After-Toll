function calCarDist(car1, car2) {
	var dist = 0;
	dist += Math.abs(car1.pos.x-car2.pos.x);
	dist -= (car1.type==="big"?LEN_BIG:LEN_SMALL)/2;
	dist -= (car2.type==="big"?LEN_BIG:LEN_SMALL)/2;
	dist -= SAFEDIST;
	if (dist < 0) dist = 0;
	return dist;
}


function updateRunQueues() {
	for (var i = 0; i < L; i++) {
		var queue = runQueues[i];
		for (var j = 0; j < queue.length; j++) {
			var car = queue[j];
			var dist = Infinity;
			if (j > 0) {
				var preCar = queue[j-1];
				dist = calCarDist(car, preCar);
				// if (dist === 0) dist += SAFEDIST / 3;
				if (dist > SAFEINTERNAL * car.v) {
					car.a = car.type==="big"?A_BIG:A_SMALL;
				} else {
					car.a = -(car.v*car.v) / (2*dist);
				}
			} else {
				var isFull = true;
				for (var k = 0; k < enterQueues[i].length; k++) {
					isFull = isFull && enterQueues[i][k].isFull;
				}
				if (isFull) {
					dist = realL0 - car.pos.x;
					var carLen = car.type==="big"?LEN_BIG:LEN_SMALL;
					dist -= carLen/2;
					dist -= LEN_BIG / 2;
					dist -= SAFEDIST;
					// if (dist === 0) dist += SAFEDIST/3;
					car.a = -(car.v*car.v) / (2*dist);
				} else {
					car.a = car.type==="big"?A_BIG:A_SMALL;
				}
			}
			if (dist <= 0) {
				car.v = 0;
				car.a = 0;
			}
			car.v += car.a * TIMEINTERVAL;
			if (isNaN(car.v)) {
				console.log("error");
			}
			if (car.v < 0) car.v = 0;
			if (car.v > MAXSPEED) {
				car.v = MAXSPEED;
				car.a = 0;
			}
			car.pos.x += car.v * TIMEINTERVAL;
			// car.pos.x += car.v * TIMEINTERVAL + car.a * TIMEINTERVAL * TIMEINTERVAL / 2;
			if (car.state === carStates.RUN && car.pos.x >= realL0) {
				// 分流选道
				car.pos.x = realL0;
				var minTime = Infinity, minPath = -1;
				for (var k = 0; k < enterQueues[i].length; k++) {
					var path = enterQueues[i][k];
					if (path.isFull) continue;
					if (path.getWaitTime() < minTime) {
						minTime = path.getWaitTime();
						minPath = k;
					}
				}
				var path = enterQueues[i][minPath];
				car.state = carStates.ENTER;

				// car.time = _time;
				path.cars.push(car);
				queue.splice(j,1);
			}
		}
	}
}

function updateCarPos() {
	updateRunQueues();

	var capacity = 0;
	var cntCar = 0;
	for (var i = 0; i < L; i++) {
		// 处理enterQueues
		var queue = enterQueues[i];
		for (var j = 0; j < queue.length; j++) {
			var path = queue[j];
			path.updateCarPos();
			capacity += path.capacity;
			cntCar += path.cars.length;
		}

		// 处理leaveQueues
		leaveQueues[i].updateCarPos();
	}
	_enterBuffer = cntCar / capacity;
	if (_enterBuffer > 1) _enterBuffer = 1;

	capacity = 0;
	cntCar = 0;
	for (var i = 0; i < L; i++) {
		var paths = leaveQueues[i].paths;
		for (var j = 0; j < paths.length; j++) {
			var path = paths[j];
			capacity += path.capacity;
			cntCar += path.cars.length;
		}

	}
	_leaveBuffer = cntCar / capacity;
	if (_leaveBuffer > 1) _leaveBuffer = 1;

	for (var i = 0; i < tmpQueue.length; i++) {
		var car = tmpQueue[i];
		car.v += car.a * TIMEINTERVAL;
		if (car.v > MAXSPEED) {
			car.v = MAXSPEED;
			car.a = 0;
		}
		car.pos.x += car.v * TIMEINTERVAL;
	}

	_meanConsumedTime = _consumedTime / _cntLeave;
	document.getElementById("mncnstime").innerHTML = round2(_meanConsumedTime);
}

function enterToLeave(path) {
	var car = path.cars.shift();
	car.a = car.type==="big"?A_BIG:A_SMALL;
	leaveQueues[path.LNo].paths[path.LBNo].cars.push(car);
	
	_cntPass += 1;
	_income += INCOME * car.dist;
	try {
		_income = round2(_income);
	} catch(e) {
		alert("hahah");
	}
	document.getElementById("income").innerHTML=_income;
}