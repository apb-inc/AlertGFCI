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
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());

var healthCheckMins = 30;
var needToSend = true;
var logOnline = false;

setInterval(function(){
    //This will check if the pi is online every x number of minutes
    checkPiHealth();
},5000);

function sendEmail(type){
    var currentTime = new Date();
    var emailContent;


    if(type == "online"){
        emailContent = "The GFCI is back online "+currentTime;

    } else if(type == "offline") {
        emailContent = "The GFCI has tripped! "+currentTime;
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
        console.log("GFCI has tripped at: "+ new Date());
        sendEmail("offline");
        needToSend = false;
    }

}

function checkPiHealth(){
    request('http://192.168.1.115:1337', function (error, response, body) {
        if(error){
            logOnline = true;
            sendAlert();
        } else {
            if(logOnline){
                console.log("GFCI is back online at: "+ new Date());
                sendEmail("online");
                logOnline = false;
            }
            needToSend = true;
        }
    });
}
