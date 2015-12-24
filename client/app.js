var express = require('express');
var app = express();
// var loginInfo = require('./loginInfo.js');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var request = require('request');
// var Gpio = require('onoff').Gpio;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 1337;
var router = express.Router();
// Route settings
app.use('/', router);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());

router.get('/', function(req,res){
    res.type('json');
    res.send({"status":"200"});
});

setInterval(function(){
    //This will check if the pi is online every 10 seconds
    checkPiHealth();

},10000);

function sendEmail(){
    var currentTime = new Date();

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
        text: "The GFCI has tripped! "+currentTime
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}



function sendAlert(){
    //code for nodemailer alert
    console.log("GFCI has tripped at: "+ new Date());
    sendEmail();
}

function checkPiHealth(){
    request('127.0.0.1:1337', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          //Response is good don't send text
        } else {
            sendAlert();
        }
    });
}
