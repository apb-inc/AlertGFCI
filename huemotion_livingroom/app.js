var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var request = require('request');
var Gpio = require('onoff').Gpio;
var sensorOne = new Gpio(14, 'in','both');
var sensorTwo = new Gpio(21, 'in','both');
var hue = require("node-hue-api");
var CronJob = require('cron').CronJob;
//var dashButton = require('node-dash-button');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT ||8080;
var router = express.Router();
// Route settings
app.use('/', router);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());

var lightsOffTime = new Date();
var lightsOffTimeTwo = new Date();
var lightTimer = 30;

var HueApi = hue.HueApi;
var lightState = hue.lightState;
var curTime;

var hostname = "192.168.0.103",
    username = "22ae6b2233c8b2971a18523e9343ca3",
    api;

api = new HueApi(hostname, username);


sensorTwo.watch(function(err, value) {
	curTime = new Date();
    if (value==1){
		console.log("Two: motion detected- "+curTime);
		if(checkTime(curTime)){
			flipHueTwoOn();
			updateHueTimerTwo();       	
		}		
    } 
});


sensorOne.watch(function(err, value) {
	curTime = new Date();
	
    if (value==1){
		console.log("One: motion detected - "+curTime);
		if(checkTime(curTime)){
			flipHueOn();
			updateHueTimer();       	
		}
    } 
});

router.get('/extend', function(req,res){
	console.log("updating hue timer via extend"+new Date());
	curTime = new Date();
	lightsOffTime = new Date(curTime.getTime() + lightTimer*60*1000);		
    res.send({"status":"200"});        
});

function checkTime(theTime){
	var shouldTurnOn = false;
	if(theTime.getHours()>=16){
		shouldTurnOn = true;
	} else if(theTime.getHours()<8){
		shouldTurnOn = true;
	}
	return shouldTurnOn;
	
}

setInterval(function(){
	curTime = new Date();
	console.log("One: Cur time"+ curTime + "lights off two time"+lightsOffTime);
	if(curTime > lightsOffTime){
		flipHueOff();
		console.log("One: flipping hue off" + new Date());
	}
}, 8*60*1000);

setInterval(function(){
	curTime = new Date();
	console.log("Two: Cur time"+ curTime + "lights off two time"+lightsOffTimeTwo);
	console.log("Lights off time"+lightsOffTimeTwo);
	if(curTime > lightsOffTimeTwo){
		flipHueTwoOff();
		console.log("Two: flipping hue off" + new Date());
	}
}, 5*60*1000);



var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

function updateHueTimer(){
	var curTime = new Date();
	lightsOffTime = new Date(curTime.getTime() + lightTimer*60*1000);		
}

function updateHueTimerTwo(){
	var curTime = new Date();
	lightsOffTimeTwo = new Date(curTime.getTime() + lightTimer*60*1000);		
}


function flipHueOn(){
	hueState = lightState.create().on();
	setLight(hueState);
}

function flipHueOff(){
	hueState = lightState.create().off();
	setLight(hueState);
}


function flipHueTwoOn(){
	hueState = lightState.create().on();
	setLightTwo(hueState);
}

function flipHueTwoOff(){
	hueState = lightState.create().off();
	setLightTwo(hueState);
}


function setLight(hueState){
	api.setLightState(5, hueState, function(err, lights) {
	    if (err) throw err;
	});
	api.setLightState(6, hueState, function(err, lights) {
	    if (err) throw err;
	});
	api.setLightState(9, hueState, function(err, lights) {
	    if (err) throw err;
	});
}

function setLightTwo(hueState){
	api.setLightState(7, hueState, function(err, lights) {
	    if (err) throw err;
	});
}


