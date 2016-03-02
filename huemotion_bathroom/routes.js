var Float = require('./controllers/float.js');


module.exports = (function() {
    var router = require('express').Router();
	router.get('/', function(req,res){
	    res.send({"status":"200"});        
	});
	
	router.post('/startFloat', function(req,res){
		var floatTime = req.body.floatTime;
		var preColor = req.body.preColor;
		var postColor = req.body.postColor;
		var hueTimeShowerFlash = req.body.hueTimeShowerFlash;
		Float.start(floatTime, preColor, postColor, hueTimeShowerFlash);
		
		
		if(floatTime&&preColor&&postColor&&hueTimeShowerFlash){
            res.send("Success");
        } else {
            res.send("Fail please supply all argumenets");
        }
		
	});
		
	router.get('/motionAfterFloat', function(req,res){
		Float.motionAfterFloat();
	    res.send({"status":"200"});        
	});		
		
	router.get('/endFloat', function(req,res){
		Float.endFloat();
	    res.send({"status":"200"});        
	});
	
    return router;
})();






