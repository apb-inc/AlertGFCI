var express = require('express');
var app = express();
var port = process.env.PORT || 2610;
var router = express.Router();
var request = require('request');
app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());



app.get('/', function(req,res){
    res.send({"status":"200"});
});
