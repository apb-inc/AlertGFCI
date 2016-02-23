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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;
var router = express.Router();
// Route settings
app.use('/', router);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());

var lightsOffTime = new Date();
var lightTimer = 20;

var HueApi = hue.HueApi;
var lightState = hue.lightState;
var curTime;

var hostname = "192.168.0.103",
    username = "22ae6b2233c8b2971a18523e9343ca3",
    api;

api = new HueApi(hostname, username);

sensorOne.watch(function(err, value) {
    if (value==1){
	console.log("flip on sensor one"+new Date());
	    flipHueOn();
        updateHueTimer();       
    } 
});

sensorTwo.watch(function(err, value) {
    if (value==1){
	console.log("flip on sensor two"+new Date());
	    flipHueOn();
        updateHueTimer();       
    } 
});


setInterval(function(){
	curTime = new Date();
	console.log("curtime"+ curTime+"light off"+lightsOffTime)
	if(curTime > lightsOffTime){
		console.log("flip off" + new Date());
		flipHueOff();
	}

}, 5*60*1000);


function updateHueTimer(){
	console.log("updating hue timer"+new Date());
	curTime = new Date();
	lightsOffTime = new Date(curTime.getTime() + lightTimer*60*1000);		
}


function flipHueOn(){
	hueState = lightState.create().on();
	setLight(hueState);
}

function flipHueOff(){
	hueState = lightState.create().off();
	setLight(hueState);
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
        
	api.setLightState(7, hueState)
	    .then()
	    .done();            
        
}
