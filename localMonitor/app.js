var debug = false;

var request = require('request');
var nodemailer = require('nodemailer');
var express = require('express');
var retry = require('retry');

var app = express();

var port = process.env.PORT || 8080;
var router = express.Router();
// Route settings
app.use('/', router);
app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());

router.get('/', function(req,res){
    res.send({"status":"200"});
});

var services = require('./source/servicesInfo.js');
var loginInfo = require('./source/loginInfo.js');
var serverInfo = require('./source/serverInfo.js');
var intervalTime = 10;

if(debug){
	intervalTime = 0.1;
}




for (var i=0;i<services.length;i++){
    services[i].isOnline = true;
    services[i].needsToSend = true;
}



setInterval(function(){
    for (var i=0;i<services.length;i++){
        checkServiceHealth(services[i].name,services[i].ip+":"+services[i].port);
    }
}, intervalTime*60*1000);

function serviceObjectFromName(serviceName){
    var found = services.filter(function(item) { return item.name === serviceName; });
    return found[0];
}

function sendMessage(alertInfo, msgContent){
    //Check if Twilio is online if offline use Node mailer
    if(alertInfo) {
		for (var i = 0; i < alertInfo.length; i++) {
			if(!debug){
				sendText(alertInfo[i],msgContent);
			}
		}
	}
}

function sendText(alertInfo, msgContent){
    request.post({
          url:	serverInfo.twilioSendServer,
          form: { toNumber: alertInfo.number, fromNumber:loginInfo.holkaAlertNumber, message: msgContent, twilioLocalKey: loginInfo.twilioLocalKey }
    }, function(error, response, body){
        if (!error && response.statusCode == 200) {
            // console.log(body);
        } else {
            console.log(new Date()+"failed to text",error);
            sendEmail(alertInfo.email,msgContent);
        }
    });
}

function sendEmail(email, msgContent){
    var currentTime = new Date();
    console.log(currentTime+"sending email");
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
        subject: 'Holka server down Alert!',
        text: msgContent
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}


function sendAlert(serviceObj, isOnline){
    var serviceName = serviceObj.name;
        if(isOnline){
            sendMessage(serviceObj.alertInfo,serviceName+" is online!");
            console.log(new Date()+serviceName+" is online!");
            serviceObj.needsToSend = true;
        } else if(serviceObj.needsToSend) {
            sendMessage(serviceObj.alertInfo,serviceName+" is offline!");
            console.log(new Date()+serviceName+" is offline!");
            serviceObj.needsToSend = false;
        }
}


// var dns = require('dns');
// var retry = require('retry');
//
// function faultTolerantResolve(address, cb) {
//   var operation = retry.operation();
//
//   operation.attempt(function(currentAttempt) {
//     dns.resolve(address, function(err, addresses) {
//       if (operation.retry(err)) {
//         return;
//       }
//
//       cb(err ? operation.mainError() : null, addresses);
//     });
//   });
// }
//
// faultTolerantResolve('nodejs.org', function(err, addresses) {
//   console.log(err, addresses);
// });


function retryRequest(name, ip, cb ){
    var operation = retry.operation({
        retries: 5,
        factor: 3,
        minTimeout: 1 * 1000,
        maxTimeout: 60 * 1000,
        randomize: true,
    });

    operation.attempt(function(currentAttempt) {

        request(ip, function (error, response, body) {
            var serviceObj = serviceObjectFromName(name);
            if(operation.retry(error)){
                return;
            }
            if(!serviceObj.isOnline){
                serviceObj.isOnline = true;
                sendAlert(serviceObj,serviceObj.isOnline);
            }
            cb(err ? operation.mainError() : null, name, ip);
        });
    });
}






function checkServiceHealth(name,ip){
    retryRequest(name,ip, function(err, name, ip){
        if(!err){
            var serviceObj = serviceObjectFromName(name);
            serviceObj.isOnline = false;
            sendAlert(serviceObj,serviceObj.isOnline);
        }
    });
}
