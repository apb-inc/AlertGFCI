var express = require('express');
var app = express();
var loginInfo = require('./loginInfo.js');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var request = require('request');
// var Gpio = require('onoff').Gpio;

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
    checkPiHealth();
},5*60*1000);

function sendEmail(type){

    var currentTime = new Date();
	currentTime = new Date(currentTime.getTime()-60*60*1000);
	var emailContent;

    if(type == "online"){
        emailContent = currentTime+"The Holka internet is back online ";
    } else if(type == "offline") {
        emailContent = currentTime+"The Holka internet has went offline! ";
    }

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: loginInfo.emailUser,
            pass: loginInfo.emailPass
        }
    });

    var mailOptions = {
        from: 'Holka Bot <holkafloat+gfciBot@gmail.com>',
        to: loginInfo.toEmailAddress,
        subject: 'Floatee update!',
        text: emailContent
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        //console.log('Message sent: ' + info.response);
    });
}

function sendAlert(){
    if(needToSend){
        console.log("Holka internet has went offline at: "+ new Date());
        sendEmail("offline");
        needToSend = false;
    }
}

function checkPiHealth(){
    request(loginInfo.ip, function (error, response, body) {
        if(error){
            logOnline = true;
            sendAlert();
        } else {
            if(logOnline){
                console.log("Holka server is back online at: "+ new Date());
                sendEmail("online");
                logOnline = false;
            }
            needToSend = true;
        }
    });
}
