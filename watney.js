var Watney = function(){};
Watney.prototype.SerialPort = require("serialport").SerialPort;
Watney.prototype.serialPort = null;
Watney.prototype.callback = null;

Watney.prototype.express = require("express");
Watney.prototype.app = null;
Watney.prototype.server = null;

Watney.prototype.init = function(serialPath,callback){
  this.callback = callback;
  /* SerialPort */
  this.serialPortInit(serialPath);
  /* api server */
  this.serverInit();
};

Watney.prototype.serialPortInit = function(serialPath){
  var _this = this;
  this.serialPort = new this.SerialPort(serialPath,{baudrate: 115200,autoOpen:false});
  this.serialPort.open(function (error) {
    console.log("open");
    if(error != null){
      _this.callback.onError(error);
    }
    else{
      _this.serialPort.on('data', _this.callback.onReceived);
    }
  });
};

Watney.prototype.write = function(data){
  console.log("write "+data);
  this.serialPort.write(data,this.callback.onError);
};

Watney.prototype.spawn = require('child_process').spawn;
Watney.prototype.webcamCaptcha = function(){
   var child = this.spawn('fswebcam', ['--no-banner', '-r', '320x320', '/home/work/watney/photo320x320.jpg']);
   child.stdout.on('data', function (data) {
     console.log("stdout");
     console.log(data);
   });
   child.stderr.on('data', function (data) {
     console.log("stdout");
     console.log(data);
   });
   child.stdout.on('end', function () {  });
};

Watney.prototype.serverInit = function(){
  var _this = this;
  this.app = this.express();
  this.server = this.app.listen(3000, function(){
    console.log("Node.js is listening to PORT:" + _this.server.address().port);
  });

  /* view */
  this.app.set('view engine', 'ejs');
  this.app.get("/", function(req, res, next){
    res.render("index", {});
  });

  /* api */
  this.app.get("/api/cmd/:cmd", function(req, res, next){
    /* SerialPort write */
    var cmd = req.params.cmd;
    _this.write(cmd);

    if(cmd == "d"){
      /* アームを下ろした時 カメラから画像取得 */
      _this.webcamCaptcha();
    }
    res.json({"response":"OK","cmd":cmd});
  });
};

module.exports = new Watney();
