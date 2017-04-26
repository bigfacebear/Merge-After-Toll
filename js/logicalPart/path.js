var Path = {
	createNew:function(LNo,BNo,LBNo,x1,y1,x2,y2) {
		var path = {};

		path.LNo = LNo;
		path.BNo = BNo;
		path.LBNo = LBNo;
		path.x1 = x1;
		path.y1 = y1;
		path.x2 = x2;
		path.y2 = y2;
		path.cars = [];
		path.len = Math.sqrt(x1*x1+x2*x2) + realL2/2;
		path.isAvailable = true;
		path.capacity = path.len / ((LEN_BIG*BIG_RATE+LEN_SMALL*(1-BIG_RATE)) + SAFEDIST * 2);

		path.isFull = false;

		var d = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
		var sinx = (y2-y1) / d;
		var cosx = (x2-x1) / d;

		var calDist = function(i) {
			var car = path.cars[i];
			var dist = 0;
			var stopDist = 0;

			if (car.pos.x < realL0 + realL1) {
				stopDist += (path.x2 - car.pos.x) / cosx;
				stopDist += realL2 / 2;
			} else {
				stopDist += realL0 + realL1 + realL2 / 2 - car.pos.x;
			}

			if (i > 0) { // 前面有车
				var preCar = path.cars[i-1];
				if (preCar.pos.x < realL0 + realL1) {
					dist += (preCar.pos.x - car.pos.x) / cosx;
				} else {
					if (car.pos.x < realL0 + realL1) {
						dist += (path.x2 - car.pos.x) / cosx;
						dist += preCar.pos.x - path.x2;
					} else {
						dist += preCar.pos.x - car.pos.x;
					}
				}
				dist -= (car.type==="big"?LEN_BIG:LEN_SMALL) / 2;
				dist -= (preCar.type==="big"?LEN_BIG:LEN_SMALL) / 2;
				// dist = dist < SAFEINTERNAL * car.v ? dist-SAFEDIST : stopDist;
				dist -= SAFEDIST;
				if (dist <= 0) dist = SAFEDIST / 3;
			} else {
				dist = stopDist - leaveQueues[LNo].paths[LBNo].remainDist;
				if (dist <= 0) dist = SAFEDIST / 3;
			}
			return dist;
		}

		path.getWaitTime = function() {
			var dist = d;
			var t = 0;
			for (var i = 0; i < this.cars.length; i++) {
				t += this.cars[i].type==="big" ? WAIT_BIG : WAIT_SMALL;
			}
			t += 2 * dist / MAXSPEED;
			return t;
		}

		path.updateCarPos = function() {
			if (path.isAvailable) {
				path.isFull = false;
			} else {
				path.isFull = true;
				return;
			}

			if (path.cars.length > 0) {
				var lastCar = path.cars[path.cars.length-1];
				var carLen = lastCar.type==="big"?LEN_BIG:LEN_SMALL;
				if (lastCar.pos.x < realL0 + SAFEDIST + carLen/2 + 3) {
					path.isFull = true;
				} else {
					path.isFull = false;
				}
			} else {
				path.isFull = false;
			}

			for (var i = 0; i < this.cars.length; i++) { // 对每一辆车
				var car = this.cars[i];
				if (car.state === carStates.PASS) continue;
				// 更新加速度信息
				var dist = calDist(i);
				if (dist > SAFEINTERNAL * car.v) {
					car.a = car.type==="big"?A_BIG:A_SMALL;
				} else {
					car.a = -(car.v*car.v) / (2*dist);
				}
				// 更新速度信息
				car.v += car.a * TIMEINTERVAL;
				if (car.v < 0) car.v = 0;
				if (car.v > MAXSPEED) {
					car.v = MAXSPEED;
					car.a = 0;
				}
				// 更新行驶距离
				var deltaD = car.v * TIMEINTERVAL;// + car.a * TIMEINTERVAL * TIMEINTERVAL / 2;
				if (deltaD < 0) deltaD = 0;
				// if (dist < 0.1) deltaD += dist;
				if (car.pos.x < realL0 + realL1) {
					deltaD *= 1000;
					car.pos.x += deltaD * cosx / 1000;
					car.pos.y += deltaD * sinx / 1000;
				} else {
					car.pos.x += deltaD;
				}
				// 如果到达付费区
				if (car.pos.x >= realL0 + realL1 + realL2/2 /*- 0.3*/) {
					car.v = 0;
					car.a = 0;
					if (car.state === carStates.ENTER) {
						car.state = carStates.PASS;
						// enterToLeave(path);
						window.setTimeout(function(){enterToLeave(path);}, (car.type==="big"?WAIT_BIG:WAIT_SMALL)*1000);
					}
				}
			}
		}

		return path;
	}
}