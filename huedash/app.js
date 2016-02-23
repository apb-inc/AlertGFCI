//warning this may trigger multiple times for one press
//...usually triggers twice based on testing for each press
dash_button = require('node-dash-button');
var dash_br = dash_button("74:c2:46:e8:91:f8"); //address from step above
var dash_lr = dash_button("10:ae:60:5d:49:cd"); //address from step above
var dash_lr_bright = dash_button("74:75:48:4a:bb:b4");

var hue = require("node-hue-api");
var express = require('express');
var app = express();
var port = process.env.PORT || 2600;
var router = express.Router();
var request = require('request');
app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());



var HueApi = hue.HueApi;
var lightState = hue.lightState;
var curTime;

var hostname = "192.168.0.103",
    username = "22ae6b2233c8b2971a18523e9343ca3",
    api;

api = new HueApi(hostname, username);

var displayError = function(err) {
    console.error(err);
};

app.get('/', function(req,res){
    res.send({"status":"200"});
});


var brightCount = 0;
dash_lr_bright.on("detected", function(){
	if(brightCount == 0){
		setHueBrightness(100);
		brightCount++;
	} else if(brightCount==1) {
		setHueBrightness(60);
		brightCount++;
	} else {
		setHueBrightness(30);
		brightCount=0;
	}
	request('http://192.168.0.111:8080/extend', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body)
		}
    });

});

var countOne=0;
dash_lr.on("detected", function (){
	if (countOne>9){
		countOne = 0;
	}
    setColor(countOne,"dash_lr");
    countOne++;
});

var countTwo=0;
dash_br.on("detected", function (){
	if (countTwo>9){
		countTwo = 0;
	}
    setColor(countTwo,"dash_br");
    countTwo++;
});

function setHueBrightness(brightness){
	console.log("setting brightness");
	hueState = lightState.create().brightness(brightness).on();
	setLight(hueState,true);
}


function setColor(count,dashBtn){
	switch(count) {
	    case 0:
			setLightFromColor("152,0,0",dashBtn);
	        break;
	    case 1:
			setLightFromColor("255,0,0",dashBtn);
	        break;
	    case 2:
			setLightFromColor("255,153,0",dashBtn);
	        break;
	    case 3:
			setLightFromColor("255,255,0",dashBtn);
	        break;
	    case 4:
			setLightFromColor("0,255,0",dashBtn);
	        break;
	    case 5:
			setLightFromColor("74,134,232",dashBtn);
	        break;
	    case 6:
			setLightFromColor("0,0,255",dashBtn);
	        break;
	    case 7:
			setLightFromColor("153,0,255",dashBtn);
	        break;
	    case 8:
			setLightFromColor("255,0,255",dashBtn);
	        break;
	    case 9:
			setLightFromColor("255,255,255",dashBtn);
	        break;
	    default:
	}
}

function setLightFromColor(color,button){
	var rgb;
    rgb = color.split(",")
    console.log("Setting color to "+color);
    console.log(rgb);
    var r=parseInt(rgb[0],10);
    var g=parseInt(rgb[1],10);
    var b=parseInt(rgb[2],10);
    hueState = lightState.create().rgb(r,g,b);
    hueState.on();
    var isDash_lr = false;
    if(button=="dash_lr"){
        isDash_lr = true;
    }
    setLight(hueState, isDash_lr);
}

function setLight(hueState, isDash_lr){
    if(isDash_lr){
        api.setLightState(5, hueState)
            .then()
            .fail(displayError)
            .done();
        api.setLightState(6, hueState)
            .then()
            .fail(displayError)
            .done();
        api.setLightState(7, hueState)
            .then()
            .fail(displayError)
            .done();
        api.setLightState(9, hueState)
            .then()
            .fail(displayError)
            .done();
    } else {
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

    }

}
