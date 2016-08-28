var mraa = require('mraa');
console.log('MRAA Version: ' + mraa.getVersion());
var u = new mraa.Uart(0);

var watney = require('./watney.js');

var WatneyCallback = function(){};
WatneyCallback.prototype.onError = function(error,results){
  console.log("onError");
  if (error != null){
    console.log(" error");
    console.log(error);
  }
  if (results != null){
    console.log(" results");
    console.log(results);
  }
};
WatneyCallback.prototype.onReceived = function(data){
  console.log("onReceived");
  console.log(data.toString('UTF-8'));
};
watney.init(u.getDevicePath(),new WatneyCallback());

var myOnboardLed = new mraa.Gpio(13);
myOnboardLed.dir(mraa.DIR_OUT);
var ledState = true;
periodicActivity();

function periodicActivity(){
  myOnboardLed.write(ledState?1:0);
  ledState = !ledState;
  setTimeout(periodicActivity,1000);
}
