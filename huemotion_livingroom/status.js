
var hue = require("node-hue-api");
var CronJob = require('cron').CronJob;



var HueApi = hue.HueApi;
var lightState = hue.lightState;
var curTime;
var theTime;
var hallLightShouldTurnOn = true;

var hostname = "192.168.0.103",
    username = "22ae6b2233c8b2971a18523e9343ca3",
    api;
    
    var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};


api = new HueApi(hostname, username);

// --------------------------
// Using a promise
api.lights()
    .then(displayResult)
    .done();
