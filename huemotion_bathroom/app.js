var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var request = require('request');
var Gpio = require('onoff').Gpio;
var sensor = new Gpio(14, 'in','both');
var hue = require("node-hue-api");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 2601;
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

sensor.watch(function(err, value) {
    if (value==1){
	console.log("flip on"+new Date());
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

router.get('/', function(req,res){
    res.send({"status":"200"});        
});

router.get('/extend', function(req,res){
	console.log("updating hue timer via extend"+new Date());
	curTime = new Date();
	lightsOffTime = new Date(curTime.getTime() + 15*60*1000);		
    res.send({"status":"200"});        
});

router.get('/reset', function(req,res){
	console.log("updating hue timer via reset"+new Date());
	curTime = new Date();
	lightsOffTime = new Date(curTime.getTime() + 2*60*100);		
    res.send({"status":"200"});        
});


var displayError = function(err) {
    console.error(err);
};



var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

function updateHueTimer(){
	console.log("updating hue timer"+new Date());
	curTime = new Date();
	lightsOffTime = new Date(curTime.getTime() + lightTimer*60*1000);		
}


function flipHueOn(){
	hueState = lightState.create().on();
	setLight(hueState,false);
}

function flipHueOff(){
	hueState = lightState.create().off();
	setLight(hueState,true);
}

function setLight(hueState,isFloat){
    api.setLightState(1, hueState)
        .then()
        .fail(displayError)
        .done();
    
    api.setLightState(2, hueState)
        .then()
		.fail(displayError)
        .done();
        
    api.setLightState(3, hueState)
        .then()
        .fail(displayError)
        .done();    
        
    if(isFloat){
		api.setLightState(8, hueState)
		    .then()
			.fail(displayError)
		    .done();            
    }
        
}


