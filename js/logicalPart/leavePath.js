var LeavePaths = {
	createNew:function(LNo) {
		var leavePaths = {};

		leavePaths.paths = [];
		leavePaths.distM = [];

		var restrictArea = false;

		var interPoint = function(a1,a2,b1,b2) {
			var x = (b2.y-a2.y+((a1.y-a2.y)/(a1.x-a2.x)*a2.x)-(b1.y-b2.y)/(b1.x-b2.x)*b2.x)/(((a1.y-a2.y)/(a1.x-a2.x))-((b1.y-b2.y)/(b1.x-b2.x)));
			var y = (b2.x-a2.x+((a1.x-a2.x)/(a1.y-a2.y)*a2.y)-(b1.x-b2.x)/(b1.y-b2.y)*b2.y)/(((a1.x-a2.x)/(a1.y-a2.y))-((b1.x-b2.x)/(b1.y-b2.y)));
			return {x:x,y:y};
		}

		leavePaths.genDistMax = function() {
			for (var i = 0; i < leavePaths.paths.length; i++) {
				leavePaths.distM[i] = [];
				for (var j = 0; j < leavePaths.paths.length; j++) {
					var a1,a2,b1,b2;
					if (i === j) {
						leavePaths.distM[i][j] = {x:Infinity,y:Infinity};
						continue;
					}
					if (leavePaths.paths[i].p1.y > leavePaths.paths[j].p1.y) {
						a1={x:leavePaths.paths[i].p1.x, y:leavePaths.paths[i].p1.y-ROADWIDTH/2};
						a2={x:leavePaths.paths[i].p2.x, y:leavePaths.paths[i].p2.y-ROADWIDTH/2};
						b1={x:leavePaths.paths[j].p1.x, y:leavePaths.paths[j].p1.y+ROADWIDTH/2};
						b2={x:leavePaths.paths[j].p2.x, y:leavePaths.paths[j].p2.y+ROADWIDTH/2};
					} else if (leavePaths.paths[i].p1.y < leavePaths.paths[j].p1.y) {
						a1={x:leavePaths.paths[i].p1.x, y:leavePaths.paths[i].p1.y+ROADWIDTH/2};
						a2={x:leavePaths.paths[i].p2.x, y:leavePaths.paths[i].p2.y+ROADWIDTH/2};
						b1={x:leavePaths.paths[j].p1.x, y:leavePaths.paths[j].p1.y-ROADWIDTH/2};
						b2={x:leavePaths.paths[j].p2.x, y:leavePaths.paths[j].p2.y-ROADWIDTH/2};
					}
					leavePaths.distM[i][j] = interPoint(a1,a2,b1,b2);
				}
			}
		}

		leavePaths.updateCarPos = function() {
			for (var i = 0; i < leavePaths.paths.length; i++) {
				var path = leavePaths.paths[i];
				
				if (path.cars.length > 0) {
					var lastCar;
					lastCar = path.cars[path.cars.length-1];
					var carLen = lastCar.type==="big"?LEN_BIG:LEN_SMALL;
					path.remainDist = -lastCar.pos.x + (realL0+realL1+realL2/2) + carLen/2;
					if (path.remainDist < 0) remainDist = 0;
				} else {
					path.remainDist = 0;
				}

				for (var j = 0; j < path.cars.length; j++) {
					var car = path.cars[j];
					var k = 1;
					var waitPoint = null;
					// find the nearest wait point
					while (true) {
						var p1=null, p2=null;
						var upPath=i-k>=0?leavePaths.paths[i-k]:null;
						var downPath=(i+k<leavePaths.paths.length)?leavePaths.paths[i+k]:null;
						var upTime=upPath===null?Infinity:upPath.toWaitPointTimeMin(leavePaths.distM[i][i-k]);
						if (upTime < Infinity) {
							var thisUpTime = path.toWaitPointTime(car, leavePaths.distM[i][i-k]);
							p1=(thisUpTime>0&&thisUpTime>upTime)?leavePaths.distM[i][i-k]:null;
						}
						var downTime=downPath===null?Infinity:downPath.toWaitPointTimeMin(leavePaths.distM[i][i+k]);
						if (downTime < Infinity) {
							var thisDownTime = path.toWaitPointTime(car, leavePaths.distM[i][i+k]);
							p2=(thisDownTime>0&&thisDownTime>downTime)?leavePaths.distM[i][i+k]:null;
						}
						if (p1 === null && p2 === null) {
							if (i-k<0 && i+k>=leavePaths.paths.length)
								break;
							k++;
							continue;
						} else if (p1 != null && p2 != null) {
							if (p1.x < p2.x) {
								waitPoint = p1;
							} else {
								waitPoint = p2;
							}
						} else if (p1 != null) {
							waitPoint = p1;
						} else if (p2 != null) {
							waitPoint = p2;
						}
						break;
					}
					// update car's accelaration
					if (waitPoint === null) {
						car.a = car.type==="big"?A_BIG:A_SMALL;
					} else {
						var dist = path.toWaitPointDist(car, waitPoint);
						if (dist > car.v * SAFEINTERNAL)
							car.a = car.type==="big"?A_BIG:A_SMALL;
						else
							car.a = -car.v / path.toWaitPointTime(car,waitPoint) / 2;
					}
					// car.a = car.type==="big"?A_BIG:A_SMALL;
					// update car's speed
					car.v += car.a * TIMEINTERVAL;
					if (car.v < 0) car.v = 0;
					if (car.v > MAXSPEED) {
						car.a = 0;
						car.v = MAXSPEED;
					}
					// update car's location
					var deltaD = car.v * TIMEINTERVAL + car.a * TIMEINTERVAL * TIMEINTERVAL / 2;
					if (deltaD < 0) deltaD = 0;
					if (car.pos.x > realL0 + realL1 + realL2) {
						deltaD *= 1000;
						car.pos.x += deltaD * path.cosx / 1000;
						car.pos.y += deltaD * path.sinx / 1000;
					} else {
						car.pos.x += deltaD;
					}
					// if reach the end
					if (car.pos.x > realL0+realL1+realL2+realL3) {
						// runQueues[path.LNo].push(path.cars.shift());
						var car = path.cars.shift();
						_consumedTime += _time - car.time;
						_cntLeave++;
						document.getElementById("cnt").innerHTML = _cntLeave;
						tmpQueue.push(car);
					}
						
				}
			}
		}

		return leavePaths;
	}
}

var LeavePath = {
	createNew:function(BNo, LNo) {
		var leavePath = {};

		leavePath.BNo = BNo;
		leavePath.LNo = LNo;

		leavePath.p1 = {
			x:realL0+realL1+realL2,
			y:B*ROADWIDTH/2 - ROADWIDTH/2 - BNo*ROADWIDTH
		}
		leavePath.p2 = {
			x:realL0+realL1+realL2+realL3,
			y:L*ROADWIDTH/2 - ROADWIDTH/2 - LNo*ROADWIDTH
		}

		leavePath.cars = [];

		var d = Math.sqrt((leavePath.p1.x-leavePath.p2.x)*(leavePath.p1.x-leavePath.p2.x) + (leavePath.p1.y-leavePath.p2.y)*(leavePath.p1.y-leavePath.p2.y));
		leavePath.sinx = (leavePath.p2.y-leavePath.p1.y) / d;
		leavePath.cosx = (leavePath.p2.x-leavePath.p1.x) / d;

		leavePath.remainDist = 0;
		leavePath.len = d + realL2 / 2;
		leavePath.capacity = leavePath.len / ((LEN_BIG*BIG_RATE+LEN_SMALL*(1-BIG_RATE)) + SAFEDIST * 2);

		leavePath.toWaitPointDist = function(car, p) {
			var dist = 0;
			var p1 = leavePath.p1;
			var p2 = leavePath.p2;
			var x=(p1.y-p.y+p.x*((p1.x-p2.x)/(p2.y-p1.y))-p1.x*((p2.y-p1.y)/(p2.x-p1.x))) / ((p1.x-p2.x)/(p2.y-p1.y)-((p2.y-p1.y)/(p2.x-p1.x)));
			
			if (car.pos.x > x) {
				return -1;
			}

			if (car.pos.x < realL0+realL1+realL2) {
				dist += realL0+realL1+realL2-car.pos.x;
				dist += (x - (realL0+realL1+realL2)) / leavePath.cosx;
				dist -= (car.type==="big"?LEN_BIG:LEN_SMALL) / 2;
			} else {
				dist += (x - car.pos.x) / leavePath.cosx;
				dist -= (car.type==="big"?LEN_BIG:LEN_SMALL) / 2;
			}
			return dist;
		}

		leavePath.toWaitPointTime = function(car, p) {
			var dist = leavePath.toWaitPointDist(car,p);
			if (dist < 0) return dist;
			return dist / car.v;
		}

		leavePath.toWaitPointTimeMin = function(p) {
			var time = Infinity;
			var p1 = leavePath.p1;
			var p2 = leavePath.p2;
			var x=(p1.y-p.y+p.x*((p1.x-p2.x)/(p2.y-p1.y))-p1.x*((p2.y-p1.y)/(p2.x-p1.x))) / ((p1.x-p2.x)/(p2.y-p1.y)-((p2.y-p1.y)/(p2.x-p1.x)));
			var dist = null;
			var car = null;
			for (var i = leavePath.cars.length-1; i >= 0; i--) {
				car = leavePath.cars[i];
				if (car.pos.x > x) {
					continue;
				}
				time = leavePath.toWaitPointTime(car, p, x);
			}
			return time;
		}

		return leavePath;
	}
}

