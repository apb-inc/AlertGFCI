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
    console.log("sending email "+content);
}

function sendAlert(serviceObj, isOnline){
    var serviceName = serviceObj.name;
    console.log("needs to send "+serviceObj.needsToSend+" isonline "+isOnline);
        if(isOnline){
            console.log(serviceName+" server is back online at: "+ new Date());
            sendEmail(new Date()+serviceName+" is online!");
            serviceObj.needsToSend = true;
        } else if(serviceObj.needsToSend) {
            console.log(serviceName+" server has went offline at: "+ new Date());
            sendEmail(new Date()+serviceName+" is offline!");
            serviceObj.needsToSend = false;
        }

}


function checkServiceHealth(name,ip){
    console.log("Checking health",name,ip);
    request(ip, function (error, response, body) {
        var serviceObj = serviceObjectFromName(name);
        if(error){
            serviceObj.isOnline = false;
            sendAlert(serviceObj,false);
        } else {
            console.log("online");
            //Is online again check to make sure it was previously offline before sending online alert
            console.log();
            if(!serviceObj.isOnline){
                console.log("about to send");
                serviceObj.isOnline = true;
                sendAlert(serviceObj,serviceObj.isOnline);
            }
        }
    });
}
