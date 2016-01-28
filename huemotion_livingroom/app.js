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
var lightTimer = 15;

var HueApi = hue.HueApi;
var lightState = hue.lightState;
var curTime;

var hostname = "192.168.0.103",
    username = "22ae6b2233c8b2971a18523e9343ca3",
    api;

api = new HueApi(hostname, username);


sensorTwo.watch(function(err, value) {
	console.log("Two val"+value);
    if (value==1){
		console.log("flip on motion two - "+new Date());
		flipHueTwoOn();
        updateHueTimerTwo();       
    } 
});



sensorOne.watch(function(err, value) {
	console.log("One val"+value);
    if (value==1){
		console.log("flip on motion one - "+new Date());
		flipHueOn();
        updateHueTimer();       
    } 
});

setInterval(function(){
	curTime = new Date();
	console.log("Cur time"+ curTime);
	console.log("Cur time"+ curTime + "lights off two time"+lightsOffTime);
	if(curTime > lightsOffTime){
		flipHueOff();
		console.log("flipping hue off");
	}
}, 8*60*1000);

setInterval(function(){
	curTime = new Date();
	console.log("Cur time"+ curTime + "lights off two time"+lightsOffTimeTwo);
	console.log("Lights off time"+lightsOffTimeTwo);
	if(curTime > lightsOffTimeTwo){
		flipHueTwoOff();
		console.log("flipping two hue off");
	}
}, 5*60*1000);



/*
var job = new CronJob({
	cronTime: '00 10 23 * * 0-6',
	onTick: function() {
		console.log("cron - " + new Date());
		flipHueOff();
		flipHueTwoOff();
	},
	start: false,
	timeZone: 'America/Chicago'
});
job.start();


var jobTwo = new CronJob({
	cronTime: '00 10 12 * * 0-6',
	onTick: function() {
		console.log("cron - " + new Date());
		flipHueOff();
		flipHueTwoOff();
	},
	start: false,
	timeZone: 'America/Chicago'
});
jobTwo.start();
*/


/*
router.get('/', function(req,res){
    res.send({"status":"200"});        
});
*/

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
    api.setLightState(5, hueState)
        .then()
        .done();
    api.setLightState(6, hueState)
        .then()
        .done(); 
    api.setLightState(9, hueState)
        .then()
        .done();  
}

function setLightTwo(hueState){
	api.setLightState(7, hueState)
        .then()
        .done(); 
}


