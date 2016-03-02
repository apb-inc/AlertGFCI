var express = require('express');
var app = express();
var request = require('request');
var port = process.env.PORT || 8080;
var router = express.Router();
// Route settings
app.use('/', router);
app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());

var healthchecks = require('healthchecks');

// This file contains all the checks
var CHECKS_FILE = __dirname + '/checks';

// Mount the middleware at /_healthchecks
app.use('/_healthchecks', healthchecks(CHECKS_FILE));


router.get('/', function(req,res){
    res.send({"status":"200"});
});
