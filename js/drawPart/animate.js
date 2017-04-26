function animate() {
	// for (var i = 0; i < carArr.length; i++) {
	// 	carArr[i].shape.position.x += 3;
	// }
	for (var i = 0; i < L; i++) {
		for (var j in runQueues[i]) {
			runQueues[i][j].setPosition(-width/2 + runQueues[i][j].pos.x * RATIO, runQueues[i][j].pos.y * RATIO);
			if (runQueues[i][j].shape.position.x >  width/2) {
				scene.remove(runQueues[i][j].shape);
				runQueues[i].splice(j,1);
			}
		}
		for (var j in enterQueues[i]) {
			var path = enterQueues[i][j];
			for (var k in path.cars) {
				path.cars[k].setPosition(-width/2 + path.cars[k].pos.x * RATIO, path.cars[k].pos.y * RATIO);
			}
		}
		for (var j in leaveQueues[i].paths) {
			var path = leaveQueues[i].paths[j];
			for (var k in path.cars) {
				path.cars[k].setPosition(-width/2 + path.cars[k].pos.x * RATIO, path.cars[k].pos.y * RATIO)
			}
		}
	}

	for (var i = 0; i < tmpQueue.length; i++) {
		var car = tmpQueue[i];
		car.setPosition(-width/2 + car.pos.x * RATIO, car.pos.y * RATIO);
	}
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}