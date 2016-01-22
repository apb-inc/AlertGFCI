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
console.log('Magic happens on port ' + port +" - "+ new Date());

var healthCheckMins = 30;
var needToSend = true;
var logOnline = false;
var needToSendGFCI = true;
var logOnlineGFCI = false;
var needToSendDash= true;
var logOnlineDash = false;


setInterval(function(){
    //This will check if the pi is online every x number of minutes
    checkPiHealth();
},5*60*1000);

setInterval(function(){
    //This will check if the pi2 GFCI is online every x number of minutes
    checkPiGFCIHealth();
},6*60*1000);

setInterval(function(){
    //This will check if the pi is online every x number of minutes
    checkPiDashHealth();
},7*60*1000);


function sendEmail(type){
    var currentTime = new Date();
    var emailContent;

    if(type == "online"){
        emailContent = "The Holka server is back online "+currentTime;
    } else if(type == "offline") {
        emailContent = "The Holka server has went offline! "+currentTime;
    } else if(type == "offlineGFCI") {
        emailContent = "The GFCI has went offline! "+currentTime;
    } else if(type == "onlineGFCI") {
        emailContent = "The GFCI has went online! "+currentTime;
    } else if(type == "offlineDash") {
        emailContent = "Node-Dash has went offline! "+currentTime;
    } else if(type == "onlineDash") {
        emailContent = "Node-Dash has went online! "+currentTime;
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
        console.log("Holka server has went offline at: "+ new Date());
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




function sendGFCIAlert(){

    if(needToSendGFCI){
        console.log("GFCI has went offline at: "+ new Date());
        sendEmail("offlineGFCI");
        needToSendGFCI = false;
    }

}

function checkPiGFCIHealth(){
    request(loginInfo.ipGFCI, function (error, response, body) {
        if(error){
            logOnlineGFCI = true;
            sendGFCIAlert();
        } else {
            if(logOnlineGFCI){
                console.log("GFCI is back online at: "+ new Date());
                sendEmail("onlineGFCI");
                logOnlineGFCI = false;
            }
            needToSendGFCI = true;
        }
    });
}



function sendDashlert(){

    if(needToSendDash){
        console.log("Dash has went offline at: "+ new Date());
        sendEmail("offlineDash");
        needToSendDash = false;
    }

}

function checkPiDashHealth(){
    request(loginInfo.ipDash, function (error, response, body) {
        if(error){
            logOnlineDash = true;
            sendDashlert();
        } else {
            if(logOnlineGFCI){
                console.log("Dash is back online at: "+ new Date());
                sendEmail("onlineDash");
                logOnlineDash = false;
            }
            needToSendDash = true;
        }
    });
}



