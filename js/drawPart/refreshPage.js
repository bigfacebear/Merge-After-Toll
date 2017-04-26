function newCarShape(type) {
	var len = (type === "big") ? LEN_BIG*RATIO : LEN_SMALL*RATIO;
	var color = (type === "big") ? 0x0000ff : 0xff0000;
	var geometry = new THREE.CubeGeometry(len,roadWidth*0.5,10);
	var material = new THREE.MeshBasicMaterial({color:color});
	var cube = new THREE.Mesh(geometry, material);
	return cube;
}

function newLine(p1,p2,type) {
	var geometry = new THREE.Geometry();
	var material;
	if (type.ifdash === true) {
		material = new THREE.LineDashedMaterial({color:type.color, linewidth:type.width, scale:1,dashSize:3,gapSize:1});
	}
	else
		material = new THREE.LineBasicMaterial({color:type.color, linewidth:type.width});
	geometry.vertices.push(p1, p2);
	return new THREE.Line(geometry, material);
}

function drawL0() {
	var y = roadWidth * L / 2;
	for (var i = 0; i < L + 1; i++) {
		var p1, p2;
		p1 = new THREE.Vector3(-width/2, y, 0);
		p2 = new THREE.Vector3(X0 - mm, y, 0);
		scene.add(newLine(p1,p2,ROADLINE));
		p1 = new THREE.Vector3(width/2, y, 0);
		p2 = new THREE.Vector3(X3 + mm, y, 0);
		scene.add(newLine(p1,p2,ROADLINE));
		y -= roadWidth;


	}
	y = roadWidth * L / 2 - roadWidth / 2;
	for (var i = 0; i < L; i++) {
		var p1, p2;
		p1 = new THREE.Vector3(-width/2, y, 0);
		p2 = new THREE.Vector3(X0 - mm, y, 0);
		scene.add(newLine(p1,p2,CARLINE));
		p1 = new THREE.Vector3(width/2, y, 0);
		p2 = new THREE.Vector3(X3 + mm, y, 0);
		scene.add(newLine(p1,p2,CARLINE));
		LArr.push(y);
		y -= roadWidth;
	}
}

function drawL2() {
	var y = B * roadWidth / 2;
	for (var i = 0; i < B + 1; i++) {
		var p1, p2;
		p1 = new THREE.Vector3(X1+mm, y, 0);
		p2 = new THREE.Vector3(X2-mm, y, 0);
		scene.add(newLine(p1,p2,ROADLINE));
		y -= roadWidth;
	}

	y = B * roadWidth / 2 - roadWidth / 2;
	for (var i = 0; i < B; i++) {
		var p1, p2;
		p1 = new THREE.Vector3(X1+mm, y, 0);
		p2 = new THREE.Vector3(X2-mm, y, 0);
		scene.add(newLine(p1,p2,CARLINE));
		BArr.push(y);
		y -= roadWidth;
	}
}

function drawShape() {
	if (shape === "normal") {
		scene.add(newLine(
			new THREE.Vector3(X0, -L * roadWidth / 2, 0),
			new THREE.Vector3(X1, -B*roadWidth/2, 0),
			ROADLINE));
		scene.add(newLine(
			new THREE.Vector3(X3, -L * roadWidth / 2, 0),
			new THREE.Vector3(X2, -B*roadWidth/2, 0),
			ROADLINE));
		scene.add(newLine(
			new THREE.Vector3(X0, L * roadWidth / 2, 0),
			new THREE.Vector3(X1, B*roadWidth/2, 0),
			ROADLINE));
		scene.add(newLine(
			new THREE.Vector3(X3, L * roadWidth / 2, 0),
			new THREE.Vector3(X2, B*roadWidth/2, 0),
			ROADLINE));
	} else if (shape === "mod1") {
		var material = new THREE.LineBasicMaterial({color:0xff0000, linewidth:ROADLINE.width});
		scene.add(new THREE.Line(getMod1Curve(R, m, "LB"), material));
		scene.add(new THREE.Line(getMod1Curve(R, m, "RB"), material));
		scene.add(new THREE.Line(getMod1Curve(R, m, "LT"), material));
		scene.add(new THREE.Line(getMod1Curve(R, m, "RT"), material));
	} else if (shape === "mod2") {
		var material = new THREE.LineBasicMaterial({color:ROADLINE.color, linewidth:ROADLINE.width});
		var y1 = L * ROADWIDTH / 2;
		var y2 = B * ROADWIDTH / 2;
		var h = Math.abs(y1-y2);
		var theta = Math.atan((h/2)/(m+realL1/2));
		var newR = Math.sqrt((m+realL1/2)*(m+realL1/2)+(h/2)*(h/2)) / (2*Math.sin(theta));
		scene.add(new THREE.Line(getMod1Curve(newR, m, "LB"), material));
		scene.add(new THREE.Line(getMod1Curve(newR, m, "RB"), material));
		scene.add(new THREE.Line(getMod1Curve(newR, m, "LT"), material));
		scene.add(new THREE.Line(getMod1Curve(newR, m, "RT"), material));
	}
}

function refreshPage() {
	scene = new THREE.Scene();

	// updateParameters();

	var sum = realL0*2 + realL1 + realL2 + realL3;
	RATIO = width / sum;
	roadWidth = ROADWIDTH * RATIO;
	var MARGIN = realL0 * RATIO;
	L1 = realL1 * RATIO;
	L2 = realL2 * RATIO;
	L3 = realL3 * RATIO;
	LArr = [];
	BArr = [];
	X0 = -width/2+MARGIN;
	X1 = -width/2+MARGIN+L1;
	X2 = -width/2+MARGIN+L1+L2;
	X3 = -width/2+MARGIN+L1+L2+L3;
	mm = shape==="normal"?0:m*RATIO;
	RR = R*RATIO;

	drawL0();
	drawL2();
	drawShape();

	document.getElementById("time").innerHTML = 0;
	document.getElementById("cnt").innerHTML = 0;

	for (var i = 0; i < L; i++) {
		var p1, p2;
		p1 = new THREE.Vector3(X0-mm, LArr[i], 0);
		for (var j = 0; j < L2B[i].length; j++) {
			p2 = new THREE.Vector3(X1+mm, BArr[L2B[i][j]], 0);
			scene.add(newLine(p1,p2,CARLINE));
		}
		p1 = new THREE.Vector3(X3+mm, LArr[i], 0);
		for (var j = 0; j < L2B[i].length; j++) {
			p2 = new THREE.Vector3(X2-mm, BArr[L2B[i][j]], 0);
			scene.add(newLine(p1,p2,CARLINE));
		}
	}

	renderer.clear();
	renderer.render(scene, camera);
}