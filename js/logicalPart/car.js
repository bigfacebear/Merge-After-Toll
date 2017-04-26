/*
车辆的类型分为大车和小车 type = "big", "small"
大车的长度为小车的两倍
它们的行驶速度是相等的
大车加速比小车慢，因此在过收费口的时候需要更多的时间
*/

var carStates = {
	RUN:"RUN",
	ENTER:"ENTER",
	PASS:"PASS",
	LEAVE:"LEAVE",
	WAIT:"WAIT"
}

var Car = {
	createNew:function(type) {
		var car = {};

		car.type = type;
		car.shape = newCarShape(type);
		car.state = carStates.RUN;
		car.pos = {
			x:0, y:0
		};
		car.v = MAXSPEED;  // m/s
		car.a = 0;  // m/s^2
		car.time = _time;
		car.dist = Math.floor(Math.random() * 110) + 10;

		car.setPosition = function(x, y) {
			this.shape.position.x = x;
			this.shape.position.y = y;
			this.shape.position.z = 0;
		}

		return car;
	}
}

function newCarRun(road) {
	var queue = runQueues[road];
	var type = Math.random() < BIG_RATE?"big":"small";
	var car = Car.createNew(type);
	var carLen = car.type==="big"?LEN_BIG:LEN_SMALL;
	if (queue.length > 0) {
		var lastCar = queue[queue.length-1];
		var lastCarLen = lastCar.type==="big"?LEN_BIG:LEN_SMALL;
		if (lastCar.pos.x - lastCarLen/2 - SAFEDIST - carLen/2 < 0) {
			return;
		}
	}
	var isFull = true;
	for (var i = 0; i < enterQueues[road].length; i++) {
		isFull = isFull && enterQueues[road][i].isFull;
	}
	car.pos.x = 0;
	car.pos.y = L/2*ROADWIDTH - ROADWIDTH/2-road*ROADWIDTH;
	waitQueue.push(car);

	if (isFull) return;
	
	car = waitQueue.shift();
	runQueues[road].push(car);
	scene.add(car.shape);
}

function delayRandom(road) {
	window.setTimeout("newCarRun("+road+")", Math.floor(Math.random() * DENSITY * 1000));
}