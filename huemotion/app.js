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
var port = process.env.PORT || 1338;
var router = express.Router();
// Route settings
app.use('/', router);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());

var lightsOffTime = new Date();
var lightTimer = 10;

var HueApi = hue.HueApi;
var lightState = hue.lightState;
var curTime;

var hostname = "192.168.1.116",
    username = "22ae6b2233c8b2971a18523e9343ca3",
    api;

api = new HueApi(hostname, username);



sensor.watch(function(err, value) {
    if (value==1){
        startHueTimer();       
    } 
});

setInterval(function(){
	curTime = new Date();
	if(curTime > lightsOffTime){
		flipHueOff();
	}

}, 1*60*1000);







router.get('/', function(req,res){
	start();
    res.send({"status":"200"});        
});



var updateTimer = function(status) {
		
	var curTime = new Date();
	lightsOffTime = new Date(curTime.getTime() + lightTimer*60*1000);		
	flipHueOn();
    //console.log(JSON.stringify(status, null, 2));
};





function startHueTimer(){
	api.lightStatus(1)
    	.then(updateTimer)
		.done();
}



/*

function setLightFromColor(color){
	var rgb;
    rgb = color.split(",")
    console.log("Setting color to "+color);
    console.log(rgb);
    var r=parseInt(rgb[0],10);
    var g=parseInt(rgb[1],10);
    var b=parseInt(rgb[2],10);
    hueState = lightState.create().rgb(r,g,b);
    hueState.on();
    setLight(hueState);
}

function setHueBrightness(brightness){
	console.log("setting brightness");
	hueState = lightState.create().brightness(brightness).on();
	setLight(hueState);
}
*/


function flipHueOn(){
	hueState = lightState.create().on();
	setLight(hueState);
}

function flipHueOff(){
	console.log("turning hue off");
	hueState = lightState.create().off();
	setLight(hueState);
}

function setLight(hueState){
    api.setLightState(1, hueState)
        .then()
        .done();
    api.setLightState(2, hueState)
        .then()
        .done();
    api.setLightState(3, hueState)
        .then()
        .done();       
}


