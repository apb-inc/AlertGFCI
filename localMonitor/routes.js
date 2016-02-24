



module.exports = (function() {
    var router = require('express').Router();

    router.get('/', function(req,res){
        res.send({"status":"200"});
    });
    
    router.get('/water', function(req,res){
        //This will be removed soon when using Httpclient to make a local call to shut off pumps
    	console.log("Water Detected!!!!" + new Date());
    	console.log("IP "+req.connection.remoteAddress);
    	console.log("User agent "+req.headers['user-agent']);
    	res.send({"status":"200"});
        console.log(req.connection.remoteAddress);
        request('http://localhost/stopPumps', function (error, response, body){
            console.log("pumps stopped");
        });
    });

    return router;
})();
