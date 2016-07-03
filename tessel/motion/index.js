// // Import the interface to Tessel hardware
// var tessel = require('tessel');
//
// // Turn one of the LEDs on to start.
// tessel.led[2].on();
//
// // Blink!
// setInterval(function () {
//   tessel.led[2].toggle();
//   tessel.led[3].toggle();
//   console.log("Y");
// }, 100);
//
// console.log("I'm blinking! (Press CTRL + C to stop)");


/*********************************************
This basic PIR example emits events when
a body is detected and when a body exits
the field.
*********************************************/

// var tessel = require('tessel');
// var pir = require('pir').use(tessel.port.A.pin[3]);
//
//
// console.log("hi");
// pir.on('ready', function (pir) {
//   console.log('Ready and waiting...');
//   pir.on('movement', function (time) {
//     console.log('Something moved! Time ' + time);
//   });
//   pir.on('stillness', function (time) {
//     console.log('All is still. Time ' + time);
//   });
// });
//
// pir.on('error', function (err) {
//   console.log(err);
// });


var tessel = require('tessel'); // Import tessel
var pirOne = tessel.port.A.pin[3]; // Select pin 2 on port A
var pirTwo = tessel.port.B.pin[3]; // Select pin 2 on port A

function foundMotionOne(){
    console.log("#1 Motion detected" + new Date());
}
function noMotionFoundOne(){
    console.log("#1 No motion detected"+ new Date());
}

function foundMotionTwo(){
    console.log("#2 Motion detected"+ new Date());
}
function noMotionFoundTwo(){
    console.log("#2 No motion detected"+ new Date());
}

var hasSeenMotionOne = false;
var hasSeenMotionTwo = false;
console.log("Start");
setInterval(function(){
    pirOne.read(function(error, value) {
      console.log(value);
      // Print the pin value to the console
      if(value===1 && !hasSeenMotionOne){
          foundMotionOne();
          hasSeenMotionOne = true;
      } else if(hasSeenMotionOne){
          noMotionFoundOne();
          hasSeenMotionOne = false;
      }
    });
    //
    //
    // pirTwo.read(function(error, value) {
    //   // Print the pin value to the console
    //   if(value===1 && !hasSeenMotionTwo){
    //       foundMotionTwo();
    //       hasSeenMotionTwo = true;
    //   } else if(hasSeenMotionTwo){
    //       noMotionFoundTwo();
    //       hasSeenMotionTwo = false;
    //   }
    // });




},1000);
