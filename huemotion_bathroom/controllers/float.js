var lights = require('./lights.js');
var hueTimeShowerFlash = 5;



var allLightsOn = true;

var timeShowerFlash = 5; 




exports.start = function(floatTime, preColor, postColor, hueTimeShowerFlash){
	timeShowerFlash = hueTimeShowerFlash;
	var allLights = false;
    var i = 0;
    var loggingInterval = setInterval(function(){
        i++;
    }, 300000);
	lights.setLightFromColor(preColor);
	lights.setHueBrightness(100,allLights);
	flashLightsDuringShower(preColor);
	console.log("floattimeis",floatTime);
	setTimeout(function(){
		console.log("Float over"+new Date());
		lights.setLightFromColor(postColor);
		lights.setHueBrightness(100,allLights);
		lights.turnLampOn();
	}, floatTime*60*1000);		
	
	
};

exports.motionAfterFloat = function(){
	allLightsOn = false;
	lights.setHueBrightness(35,allLightsOn);
	lights.turnLampOff();
};


function flashLightsDuringShower(preColor){
	console.log("Will flashing lights during shower:" + new Date());
	setTimeout(function(){
	    lights.setLightFromColor("255,255,255");
		lights.setHueBrightness(50);
		setTimeout(function(){
			lights.setLightFromColor(preColor);
		},1000);
		setTimeout(function(){
			lights.setLightFromColor("255,255,255");
		},2000);
		setTimeout(function(){
			lights.setLightFromColor(preColor);
		},3000);
		setTimeout(function(){
			lights.setLightFromColor("255,255,255");
		},4000);
		setTimeout(function(){
			lights.setLightFromColor(preColor);
		},5000);
		setTimeout(function(){
			lights.setLightFromColor("255,255,255");
		},6000);
		setTimeout(function(){
			lights.setLightFromColor(preColor);
		},7000);
		
    },timeShowerFlash*60*1000);
}


var displayError = function(err) {
    console.error(err);
};
