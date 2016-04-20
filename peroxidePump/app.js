var express = require('express');
var app = express();
var port = process.env.PORT || 2610;
var router = express.Router();
var request = require('request');
var Gpio = require('onoff').Gpio;
var peroxidePump = new Gpio(22, 'out');
app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());


function turnDosePumpOn(){
    var isPumpActive = false;
    if(!floatInProgress){
        peroxidePump.writeSync(1);
        isPumpActive = true;
    } else {
        //add text message for float in progress when dosing peroxide
        console.log(new Date()+" Float is in progress when trying to pump peroxide!");
    }
    return isPumpActive;
}

function dosePumpOff(){
    peroxidePump.writeSync(0);
}

function dosePump(pumpMins){
    if(turnDosePumpOn()){
        setTimeout(function(){
            dosePumpOff();
        }, pumpMins*60*1000);
    }
}

var dosePumpMorning = new CronJob('00 30 7 * * *', function() {
        dosePump(3);
    }, function () {
    /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    'America/Chicago'
);

var dosePumpAfternoon = new CronJob('00 30 13 * * *', function() {
        dosePump(3);
    }, function () {
    /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    'America/Chicago'
);

var dosePumpNight = new CronJob('00 55 23 * * *', function() {
        dosePump(3);
    }, function () {
    /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    'America/Chicago'
);

app.get('/', function(req,res){
    res.send({"status":"200"});
});

app.get('/peroxidePump/:state/:pumpTime', function(req,res){
    if(req.params.state == "on"){
        dosePump(req.params.pumpTime);
    } else {
        dosePumpOff();
    }
    res.send({"status":"200"});
});
