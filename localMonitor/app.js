var express = require('express');
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
