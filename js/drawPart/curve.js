function getTheta(R, m) {
	var y1 = L * ROADWIDTH / 2;
	var y2 = B * ROADWIDTH / 2;
	var h = Math.abs(y1-y2);
	x = Math.sqrt((R-h/2)*(R-h/2) + (m+realL1/2)*(m+realL1/2) - R*R);
	var beta = Math.atan(x/R);
	return Math.atan((m+realL1/2)/(R-h/2)) - beta;
}

function getMod1Curve(R, m, pos) {
	var O;
	var RR = R * RATIO;
	var mm = m * RATIO;
	var theta = getTheta(R, m);
	var x0, y0, time = 10000, t, delta = theta/time;
	var geometry = new THREE.Geometry();
	if (pos === "LB") {
		O = new THREE.Vector3(-width/2+(realL0-m)*RATIO, (-L*ROADWIDTH/2-R)*RATIO, 0);
		t = 0;
		for (var i = 0; i < time; i++) {
			geometry.vertices.push(new THREE.Vector3(O.x+RR*Math.sin(t), O.y+RR*Math.cos(t), 0));
			t += delta;
		}
		O = new THREE.Vector3(X1+mm, (-B*ROADWIDTH/2+R)*RATIO, 0);
		t = Math.PI+theta;
		for (var i = 0; i < time; i++) {
			geometry.vertices.push(new THREE.Vector3(O.x+RR*Math.sin(t), O.y+RR*Math.cos(t), 0));
			t -= delta;
		}
	} else if (pos === "RB") {
		O = new THREE.Vector3(width/2-(realL0-m)*RATIO, (-L*ROADWIDTH/2-R)*RATIO, 0);
		t = 0;
		for (var i = 0; i < time; i++) {
			geometry.vertices.push(new THREE.Vector3(O.x+RR*Math.sin(t), O.y+RR*Math.cos(t), 0));
			t -= delta;
		}
		O = new THREE.Vector3(X2-mm, (-B*ROADWIDTH/2+R)*RATIO, 0);
		t = Math.PI-theta;
		for (var i = 0; i < time; i++) {
			geometry.vertices.push(new THREE.Vector3(O.x+RR*Math.sin(t), O.y+RR*Math.cos(t), 0));
			t += delta;
		}
	} else if (pos === "RT") {
		O = new THREE.Vector3(width/2-(realL0-m)*RATIO, (L*ROADWIDTH/2+R)*RATIO, 0);
		t = Math.PI;
		for (var i = 0; i < time; i++) {
			geometry.vertices.push(new THREE.Vector3(O.x+RR*Math.sin(t), O.y+RR*Math.cos(t), 0));
			t += delta;
		}
		O = new THREE.Vector3(X2-mm, (B*ROADWIDTH/2-R)*RATIO, 0);
		t = theta;
		for (var i = 0; i < time; i++) {
			geometry.vertices.push(new THREE.Vector3(O.x+RR*Math.sin(t), O.y+RR*Math.cos(t), 0));
			t -= delta;
		}
	} else {
		O = new THREE.Vector3(-width/2+(realL0-m)*RATIO, (L*ROADWIDTH/2+R)*RATIO, 0);
		t = Math.PI;
		for (var i = 0; i < time; i++) {
			geometry.vertices.push(new THREE.Vector3(O.x+RR*Math.sin(t), O.y+RR*Math.cos(t), 0));
			t -= delta;
		}
		O = new THREE.Vector3(X1+mm, (B*ROADWIDTH/2-R)*RATIO, 0);
		t = -theta;
		for (var i = 0; i < time; i++) {
			geometry.vertices.push(new THREE.Vector3(O.x+RR*Math.sin(t), O.y+RR*Math.cos(t), 0));
			t += delta;
		}
	}
	return geometry;
}