var express = require('express');
var app = express();
var port = process.env.PORT || 2610;
var router = express.Router();
var request = require('request');
var Gpio = require('onoff').Gpio;
var peroxidePump = new Gpio(22, 'out');
app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());


function dosePump(pumpMins){
    if(!floatInProgress){
        peroxidePump.writeSync(1);
        setTimeout(function(){
            peroxidePump.writeSync(0);
        }, pumpMins*60*1000);
    } else {
        //add text message for float in progress when dosing peroxide
        console.log(new Date()+" Float is in progress when trying to pump peroxide!");
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


app.get('/on', function(req,res){
    dosePump(3);
    res.send({"status":"200"});
});

app.get('/off', function(req,res){
    dosePump(3);
    res.send({"status":"200"});
});
