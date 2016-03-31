var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var request = require('request');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 31337;
var router = express.Router();
// Route settings
app.use('/', router);
app.listen(port);
var currentTimeo = new Date();
console.log('Magic happens on port ' + port +" - "+ currentTimeo);

var rpi433    = require('rpi-433'),
    rfSniffer = rpi433.sniffer(21, 500), //Snif on PIN 22 with a 500ms debounce delay
    rfSend    = rpi433.sendCode;

// Receive
rfSniffer.on('codes', function (code) {
  console.log('Code received: '+code);
});

// Send
rfSend(1234, 22, function(error, stdout) {   //Send 1234
  if(!error) console.log(stdout); //Should display 1234
});

/*
You can also use rfSend like that :

rfSend(code);
rfSend(code, pin);
rfSend(code, callback);
rfSend(code, pin, callback);
*/


setInterval(function(){
    //This will check if the pi is online every x number of minutes
    console.log("Test every 5 seconds");
},5*60*1000);


app.get('/', function(req,res){
    res.send({"status":"200"});
});
