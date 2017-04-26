var width = window.innerWidth * 0.9;
var height = window.innerHeight * 0.8;

var roadWidth;
var X0, X1, X2, X3;
var RR, mm;
var RATIO;

var ROADLINE = {color:0x000000, width:3, ifdash:false};
var CARLINE = {color:0xBEBEBE, width:1, ifdash:true};
var CENTERLINE = {color:0xff0000, width:4, ifdash:false};

var LArr = [];
var BArr = [];

// renderer.clear();
// renderer.render(scene, camera);
// refreshPage();

// animate();

function drawPart() {
	renderer.clear();
	renderer.render(scene, camera);
	refreshPage();

	animate();
}

// logicalPart();
// drawPart();