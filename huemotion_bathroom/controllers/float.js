var Lights = require('./controllers/lights.js');
var hueTimeShowerFlash = 5;

//startfloat
Lights.setLightFromColor(preColor);
Lights.setHueBrightness(100);
Lights.flashLightsDuringShower();
//startfloat



//endfloat
Lights.setHueBrightness(100);
Lights.setLightFromColor(postColor);
//endfloat

var allLightsOn = true;



exports.start = function(floatTime, preColor, postColor){
    var i = 0;
    var loggingInterval = setInterval(function(){
        i++;
    }, 300000);
	Lights.setLightFromColor(preColor);
	Lights.setHueBrightness(100);
	flashLightsDuringShower();

	setTimeout(function(){
		Lights.setLightFromColor(postColor);
		Lights.setHueBrightness(100);
	}, floatTime*60*1000);		
	
	
};

exports.motionAfterFloat = function(){
	Lights.setHueBrightness(35);
};

var displayError = function(err) {
    console.error(err);
};



function extendHueLightTimer(){
	request('http://localhost:2601/extend', function (error, response, body){
		if (!error && response.statusCode == 200) {
// 		    console.log("Successfully extended light timer"+ new Date());
		} else {
			console.log("error extending light timer" + new Date());
		}
	});

}

function resetHueLightTimer(){
	request('http://localhost:2601/reset', function (error, response, body){
		if (!error && response.statusCode == 200) {
		    //console.log("Successfully reset light timer"+ new Date());
		} else {
			console.log("error reseting light timer"+ new Date());
		}
	});

}

function flashLightsDuringShower(){
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

    },hueTimeShowerFlash*60*1000);
}


