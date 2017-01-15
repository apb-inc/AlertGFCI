var tessel = require('tessel'); // Import tessel
var pin = tessel.port.B.pin[2];
pin.pull('pullup');

var hasBeenOn = false;
console.log("Start");

setInterval(function(){
    pin.read(function(error, value) {
        if(value===1 && !hasBeenOn){
            hasBeenOn = true;
            console.log("Outlet On");
        } else if(value===0 && hasBeenOn){
            hasBeenOn = false;
            console.log("Outlet Off");
        }
    });

},10);


//
// pin.pull('pulldown');
//
// pin.on('change', function() {
//     this.read(function(err, val) {
//         console.log('val', val);
//     });
// });
