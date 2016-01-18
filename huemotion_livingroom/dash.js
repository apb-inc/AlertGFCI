//warning this may trigger multiple times for one press
//...usually triggers twice based on testing for each press
dash_button = require('node-dash-button');
var dash = dash_button("74:c2:46:e8:91:f8"); //address from step above
console.log("start");
dash.on("detected", function (){
		    console.log("omg found");
});


