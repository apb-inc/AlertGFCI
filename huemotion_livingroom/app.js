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
var theTime;

var hostname = "192.168.0.103",
    username = "22ae6b2233c8b2971a18523e9343ca3",
    api;

api = new HueApi(hostname, username);



sensorTwo.watch(function(err, value) {
	curTime = new Date();
    if (value==1){
		flipHueTwoOn();
		updateHueTimerTwo();       	
    } 
});


sensorOne.watch(function(err, value) {
	curTime = new Date();
    if (value==1){
		if(checkIsDayTime(curTime)){
			flipHueOn();
			updateHueTimer();       	
		}
    } 
});

router.get('/extend', function(req,res){
	console.log("updating hue timer via extend"+new Date());
	curTime = new Date();
	lightsOffTime = new Date(curTime.getTime() + lightTimer*60*1000);	
	lightsOffTimeTwo = new Date(curTime.getTime() + lightTimer*60*1000);		
    res.send({"status":"200"});        
});

function checkIsDayTime(theTime){
	var shouldTurnOn = false;
	if(theTime.getHours()>=16){
		shouldTurnOn = true;
	} else if(theTime.getHours()<8){
		shouldTurnOn = true;
	}
	return shouldTurnOn;
}

function checkTimeForRandom(theTime){
	var shouldTurnOn = false;
	if(theTime.getHours()>=16 && theTime.getHours()<=22){
		shouldTurnOn = true;
	} else if(theTime.getHours()<8 && theTime.getHours()>=6){
		shouldTurnOn = true;
	}
	return shouldTurnOn;
}

setInterval(function(){
	curTime = new Date();
	if(curTime > lightsOffTime){
		flipHueOff();
		console.log("One: flipping hue off" + new Date());
	}
}, 8*60*1000);

setInterval(function(){
	curTime = new Date();
	if(curTime > lightsOffTimeTwo){
		flipHueTwoOff();
	}
}, 5*60*1000);



var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};



function updateHueTimer(){
	curTime = new Date();
	lightsOffTime = new Date(curTime.getTime() + lightTimer*60*1000);		
}

function updateHueTimerTwo(){
	curTime = new Date();
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
	api.setLightState(11, hueState, function(err, lights){
		if(err) throw err;
	});
	api.setLightState(12, hueState, function(err, lights){
		if(err) throw err;
	});
}

function setLightTwo(hueState){
	api.setLightState(7, hueState, function(err, lights) {
	    if (err) throw err;
	});
}


var dimLightsInEvening= new CronJob('00 55 19 * * *', function() {
		hueState = lightState.create().brightness(50).ct(500).on();
		setLight(hueState);
		setLightTwo(hueState);
	}, function () {
	/* This function is executed when the job stops */
	},
	true, /* Start the job right now */
	'America/Chicago'
);

var dimLightsInEveningThirty= new CronJob('00 30 20 * * *', function() {
		hueState = lightState.create().brightness(30).ct(500).on();
		setLight(hueState);
		setLightTwo(hueState);
	}, function () {
	/* This function is executed when the job stops */
	},
	true, /* Start the job right now */
	'America/Chicago'
);

var dimLightsInEveningTwenty= new CronJob('00 45 20 * * *', function() {
		hueState = lightState.create().brightness(20).ct(500).on();
		setLight(hueState);
		setLightTwo(hueState);
	}, function () {
	/* This function is executed when the job stops */
	},
	true, /* Start the job right now */
	'America/Chicago'
);


var dimLightsInEveningTen= new CronJob('00 45 21 * * *', function() {
		hueState = lightState.create().brightness(20).ct(500).on();
		setLight(hueState);
		setLightTwo(hueState);
	}, function () {
	/* This function is executed when the job stops */
	},
	true, /* Start the job right now */
	'America/Chicago'
);

function randomizeLights(bright){
	var r = Math.floor((Math.random() * 255) + 1);
	var g = Math.floor((Math.random() * 255) + 1);
	var b = Math.floor((Math.random() * 255) + 1);
	if(bright){
		hueState = lightState.create().brightness(75).rgb(r,g,b).on();
	} else {
		hueState = lightState.create().rgb(r,g,b).on();
	}
	setLight(hueState);
	setLightTwo(hueState);
}


setInterval(function(){
	theTime = new Date();
	var bright = false;
	console.log("test");
	if(checkTimeForRandom(theTime)){
		randomizeLights(bright);
	}
		
}, .5*60*1000);


var brightenLightsMorning= new CronJob('00 45 5 * * *', function() {
	
	var bright = true;
	randomizeLights(bright);


	}, function () {
	/* This function is executed when the job stops */
	},
	true, /* Start the job right now */
	'America/Chicago'
);


    




