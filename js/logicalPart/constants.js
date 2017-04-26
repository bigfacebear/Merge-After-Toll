

var ROADWIDTH = 5.7;//m

var SAFEDIST = 3;//m
// var MAXSPEED = 12;//m/s

var BIG_RATE = 1/4;  // bigCarNumber : (bigCarNumber+smallCarNumber)

// length of cars
var LEN_BIG = 8;//m
var LEN_SMALL = 4;//m
var CAR_WIDTH = 2;//m
// accelaration
var A_BIG = 2;//m/s^2
var A_SMALL = 3;//m/s^2
// the max speed
var MAXSPEED = 12;//m/s
// flow control
var SAFEINTERNAL = 3;//s
// delta time
var TIMEINTERVAL = 0.02;//s


function round2(num) {
	return Math.round(num*100) / 100;
}