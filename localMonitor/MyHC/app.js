var express = require('express');
var app = express();
var request = require('request');
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

function sendEmail(content){
    //Check if Twilio is online if offline use Node mailer
    console.log("sending email "+content);
}

function sendAlert(serviceObj, isOnline){
    var serviceName = serviceObj.name;
        if(isOnline){
            sendEmail(new Date()+serviceName+" is online!");
            serviceObj.needsToSend = true;
        } else if(serviceObj.needsToSend) {
            sendEmail(new Date()+serviceName+" is offline!");
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
