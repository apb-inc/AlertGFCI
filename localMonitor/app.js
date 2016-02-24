var express = require('express');
var app = express();
var request = require('request');
var port = process.env.PORT || 8080;

// Route settings

app.use('/', routes);

app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());
