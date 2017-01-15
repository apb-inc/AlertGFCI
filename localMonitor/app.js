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
<<<<<<< HEAD
=======
});

router.get('/water', function(req,res){
	console.log("Water Detected!!!!" + new Date());
	console.log("IP "+req.connection.remoteAddress);
	console.log("User agent "+req.headers['user-agent']);
	res.send({"status":"200"});
    console.log(req.connection.remoteAddress);
    request('http://localhost/stopPumps', function (error, response, body){
        console.log("pumps stopped");
    });
>>>>>>> beb4aad3e899434d21531a91ebf0ae2cc4c34fa7
});
