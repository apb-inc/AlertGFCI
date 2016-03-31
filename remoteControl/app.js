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
currentTimeo = new Date(currentTimeo.getTime()-60*60*1000);
console.log('Magic happens on port ' + port +" - "+ currentTimeo);

var healthCheckMins = 30;
var needToSend = true;
var logOnline = false;

setInterval(function(){
    //This will check if the pi is online every x number of minutes
    console.log("Test every 5 seconds");
},5*60*1000);


app.get('/', function(req,res){
    res.send({"status":"200"});
});
