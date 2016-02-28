var Float = require('./controllers/float.js');


module.exports = (function() {
    var router = require('express').Router();
	router.get('/', function(req,res){
	    res.send({"status":"200"});        
	});
	
	router.post('/startFloat', function(req,res){
		var floatTime = req.body.floatTime;
		var preFloatColor = req.body.preFloatColor;
		var postFloatColor = req.body.postFloatColor;
		Float.start(floatTime, preFloatColor, postFloatColor);
		
		
		if(floatTime&&preFloatColor&&postFloatColor){
            res.send("Success");
        } else {
            res.send("Fail please supply all argumenets");
        }
		
	});
	
	router.get('/extend', function(req,res){
		console.log("updating hue timer via extend"+new Date());
		curTime = new Date();
		lightsOffTime = new Date(curTime.getTime() + 15*60*1000);		
	    res.send({"status":"200"});        
	});
	
	router.get('/motionAfterFloat', function(req,res){
		Float.motionAfterFloat();
	    res.send({"status":"200"});        
	});
	
	
	router.get('/reset', function(req,res){
		console.log("updating hue timer via reset"+new Date());
		curTime = new Date();
		lightsOffTime = new Date(curTime.getTime() + 2*60*100);		
	    res.send({"status":"200"});        
	});
		
		
	router.get('/endFloat', function(req,res){
		Float.endFloat();
	    res.send({"status":"200"});        
	});
	
    return router;
})();






