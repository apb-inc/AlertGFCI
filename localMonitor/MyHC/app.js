var express = require('express');
var app = express();
var request = require('request');
var port = process.env.PORT || 8080;
var router = express.Router();
// Route settings
app.use('/', router);
app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());

router.get('/', function(req,res){
    res.send({"status":"200"});
});

var services = [
    {
        name:"Local Monitor",
        ip:"http://127.0.0.1:2600",
        alertNumbers:"555-555-5555",
        alertEmails:"me@gmail.com,you@gmail.com",
        isOnline:true,
        needsToSend:true
    },
    {
        name:"Test",
        ip:"http://127.0.0.1:8081",
        alertNumbers:"555-555-5555",
        alertEmails:"me@gmail.com,you@gmail.com",
        isOnline:true,
        needsToSend:true
    }
];

console.log("ye");

setInterval(function(){
    console.log("checck");

    for (var i=0;i<services.length;i++){
        console.log("checking"+services[i].name);
        checkServiceHealth(services[i].name,services[i].ip);
    }
}, 5000);


function serviceObjectFromName(serviceName){
    var found = services.filter(function(item) { return item.name === serviceName; });
    return found[0];
}

function sendEmail(content){
    console.log("sending email "+content);
}

function sendAlert(serviceObj, isOnline){
    var needsToSend = serviceObj.needsToSend;
    if(needsToSend){
        if(isOnline){
            console.log(serviceObj.name+" server is back online at: "+ new Date());
            sendEmail(new Date()+serviceObj.name+" is online!");
        } else {
            console.log(serviceObj.name+" server has went offline at: "+ new Date());
            sendEmail(new Date()+serviceObj.name+" is offline!");
        }
        needsToSend = false;
    }
}


function checkServiceHealth(name,ip){
    console.log("Checking health",name,ip);
    request(ip, function (error, response, body) {
        var serviceObj = serviceObjectFromName(name);
        var isOnline = serviceObj.isOnline;
        console.log(error);
        if(error){
            console.log("ERRRRRR");
            isOnline = false;
            sendAlert(serviceObj,isOnline);
            serviceObj.needsToSend = false;
        } else {
            //Is online again check to make sure it was previously offline before sending online alert
            if(!isOnline){
                isOnline = true;
                sendAlert(serviceObj,isOnline);
            }
        }
    });
}
