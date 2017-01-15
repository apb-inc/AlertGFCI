var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 2601;
// Route settings
var routes = require('./routes.js');
app.use('/', routes);
app.listen(port);
console.log('Magic happens on port ' + port +" - "+ new Date());


var Main = require('./controllers/main.js');


Main.start();
