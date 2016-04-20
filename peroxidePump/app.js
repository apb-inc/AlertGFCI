var express = require('express');
var app = express();
var port = process.env.PORT || 2610;
var router = express.Router();
var request = require('request');
var Gpio = require('onoff').Gpio;
var pump = new Gpio(22, 'out');


app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());



app.get('/', function(req,res){
    res.send({"status":"200"});

});


app.get('/on', function(req,res){
    pump.writeSync(1);
    res.send({"status":"200"});
});

app.get('/off', function(req,res){
    pump.writeSync(0);
    res.send({"status":"200"});
});
