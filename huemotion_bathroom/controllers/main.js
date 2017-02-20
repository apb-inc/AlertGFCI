var Gpio = require('onoff').Gpio;
var sensor_br = new Gpio(14, 'in','both');
var sensor_fr = new Gpio(21, 'in','both');
var CronJob = require('cron').CronJob;


var lightsOffTime = new Date();
var lightTimer = 25;
var curTime;


var lights = require('./lights.js');
var bathroomTimeoutMins = 25;
var floatRoomTimeoutMins = 60;


exports.start = function(){
	sensor_br.watch(function(err, value) {
		var allLightsOn = false;

	    if (value==1){
		    console.log("-----------------------------------------------------------------");
			console.log("Flip on from bathroom sensor"+new Date());
		    lights.flipHueOn(allLightsOn);
	        updateHueTimer(bathroomTimeoutMins);
	    }
	});

	sensor_fr.watch(function(err, value) {
		var allLightsOn = true;
	    if (value==1){
		    console.log("-----------------------------------------------------------------");
			console.log("Flip on from float room sensor"+new Date());
		    lights.flipHueOn(allLightsOn);
	        updateHueTimer(floatRoomTimeoutMins);
	    }
	});

	setInterval(function(){
		curTime = new Date();
		console.log("curtime"+ curTime+"light off"+lightsOffTime);
		if(curTime > lightsOffTime){
			console.log("Flip off" + new Date());
			lights.flipHueOff();
		}
	}, 1*60*1000);	
	

	var dimLightsAtNight = new CronJob('00 45 7 * * *', function() {

			var allLights = false;
			lights.setHueBrightness(5,allLights);
			lights.setHueColorTemp(500,allLights);
			lights.bathroomLights(false);
			lights.turnBedroomLampsOn();

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

	var bedroomLampOffInMorning = new CronJob('00 30 8 * * *', function() {
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

function bath(){
	var allLightsOn = false;
	lights.flipHueOn(allLightsOn);
	        updateHueTimer(60);
	
}


module.exports.bath = bath;
module.exports.updateHueTimer = updateHueTimer;
