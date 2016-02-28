var hue = require("node-hue-api");

var HueApi = hue.HueApi;
var lightState = hue.lightState;

var hostname = "192.168.0.103",
    username = "22ae6b2233c8b2971a18523e9343ca3",
    api;

api = new HueApi(hostname, username);



function setLightFromColor(color){
	var rgb;
    rgb = color.split(",");
    console.log("Setting color to "+color);
    console.log(rgb);
    var r=parseInt(rgb[0],10);
    var g=parseInt(rgb[1],10);
    var b=parseInt(rgb[2],10);
    hueState = lightState.create().rgb(r,g,b);
    hueState.on();
    set(hueState);
}

function setHueBrightness(brightness, allLightsOn){
	console.log("setting brightness");
	hueState = lightState.create().brightness(brightness).on();
	set(hueState,allLightsOn);
}



function flipHueOn(allLightsOn){
	hueState = lightState.create().on();
	set(hueState,allLightsOn);
};

function flipHueOff(){
	hueState = lightState.create().off();
	set(hueState,true);
};

function set(hueState,allLightsOn){
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
        
    if(allLightsOn){
		api.setLightState(8, hueState)
		    .then()
			.fail(displayError)
		    .done();            
    }
        
};

module.exports.set = set;
module.exports.flipHueOff = flipHueOff;
module.exports.flipHueOn = flipHueOn;
