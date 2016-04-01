var Gpio = require('onoff').Gpio;
var sensor_br = new Gpio(14, 'in','both');
var sensor_fr = new Gpio(21, 'in','both');
var CronJob = require('cron').CronJob;


var lightsOffTime = new Date();
var lightTimer = 25;
var curTime;


var lights = require('./lights.js');



exports.start = function(){
	sensor_br.watch(function(err, value) {
		var allLightsOn = false;
	
	    if (value==1){
		    console.log("-----------------------------------------------------------------");
			console.log("Flip on from bathroom sensor"+new Date());
		    lights.flipHueOn(allLightsOn);
	        updateHueTimer(20);       
	    } 
	});
	
	sensor_fr.watch(function(err, value) {
		var allLightsOn = true;
	    if (value==1){
		    console.log("-----------------------------------------------------------------");
			console.log("Flip on from float room sensor"+new Date());
		    lights.flipHueOn(allLightsOn);
	        updateHueTimer(5);       
	    } 
	});
	
	setInterval(function(){
		curTime = new Date();
		console.log("curtime"+ curTime+"light off"+lightsOffTime)
		if(curTime > lightsOffTime){
			console.log("Flip off" + new Date());
			lights.flipHueOff();
		}
	}, 1*60*1000);	
	
	
	var dimLightsAtNight = new CronJob('00 30 20 * * *', function() {
			var allLights = false;
			lights.setHueBrightnessLightsOff(20,allLights);
			lights.setHueColorTemp(500,allLights);
		}, function () {
		/* This function is executed when the job stops */
		},
		true, /* Start the job right now */
		'America/Chicago'
	);
	
	var brightenLightsInMorning = new CronJob('00 30 4 * * *', function() {
		var allLights = false;
		lights.setHueBrightness(50,allLights);
		lights.setHueColorTemp(500,allLights);
		}, function () {
		/* This function is executed when the job stops */
		},
		true, /* Start the job right now */
		'America/Chicago'
	);
	
	var brightenLightsInMorning = new CronJob('00 30 5 * * *', function() {
			lights.turnBedroomLampOff();
		}, function () {
		/* This function is executed when the job stops */
		},
		true, /* Start the job right now */
		'America/Chicago'
	);
	
	
	
};


function updateHueTimer(time){
	console.log("updating hue timer"+new Date());
	if(!time){
		time = lightTimer;
	}
	curTime = new Date();
	lightsOffTime = new Date(curTime.getTime() + time*60*1000);		
}




module.exports.updateHueTimer = updateHueTimer;
