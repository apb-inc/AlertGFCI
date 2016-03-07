var request = require('request');
var nodemailer = require('nodemailer');
var express = require('express');
var app = express();

var port = process.env.PORT || 8188;
var router = express.Router();
// Route settings
app.use('/', router);
app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());

router.get('/', function(req,res){
    res.send({"status":"200"});
});
var services = require('./services.js');

setInterval(function(){
    for (var i=0;i<services.length;i++){
        checkServiceHealth(services[i].name,services[i].ip);
    }
}, 2000);

function serviceObjectFromName(serviceName){
    var found = services.filter(function(item) { return item.name === serviceName; });
    return found[0];
}

function sendMessage(content){

    //Check if Twilio is online if offline use Node mailer

	request.post({
          url:	serverInfo.twilioSendServer,
          form: { toNumber: toNumber, fromNumber:loginInfo.holkaAlertNumber, message: msgContent, twilioLocalKey: loginInfo.twilioLocalKey }
    }, function(error, response, body){
        if (!error && response.statusCode == 200) {
            console.log(body);
        } else {
            sendEmail();
        }
    });


    console.log("sending email "+content);
}


function sendEmail(email,type){
    var emailContent = "";
    var currentTime = new Date();

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: loginInfo.gmailHolkaUser,
            pass: loginInfo.gmailHolkaPass
        }
    });
    var mailOptions = {
        from: loginInfo.fromEmail,
        to: email,
        subject: 'Floatee update!',
        text: emailContent
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

function sendEmail(content){

}

function sendAlert(serviceObj, isOnline){
    var serviceName = serviceObj.name;
        if(isOnline){
            sendMessage(new Date()+serviceName+" is online!");
            serviceObj.needsToSend = true;
        } else if(serviceObj.needsToSend) {
            sendMessage(new Date()+serviceName+" is offline!");
            serviceObj.needsToSend = false;
        }

}


function checkServiceHealth(name,ip){
    request(ip, function (error, response, body) {
        var serviceObj = serviceObjectFromName(name);
        if(error){
            serviceObj.isOnline = false;
            sendAlert(serviceObj,false);
        } else {
            if(!serviceObj.isOnline){
                serviceObj.isOnline = true;
                sendAlert(serviceObj,serviceObj.isOnline);
            }
        }
    });
}
