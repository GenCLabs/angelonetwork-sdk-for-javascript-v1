var program = "";
var opsys = process.platform;
if (opsys == "darwin") {
  program = __dirname + "/crypto/"+ opsys +"/crypto";
} else if (opsys == "win32" || opsys == "win64") {
  program = __dirname + "/crypto/"+ opsys +"/crypto.exe";
} else if (opsys == "linux") {
  program = __dirname + "/crypto/"+ opsys +"/crypto";
} else {
  program = __dirname + "/crypto/crypto";
}

var crypttype = "ecc"; // ecc | aes
var execFile = require('child_process').execFile

exports.getEncryptionType = function(){
  return crypttype;
}

exports.genkey = function(filename, callback){
  var child = execFile(program, ["genkeyText", crypttype],
    function (error, stdout, stderr) {
      //console.log(stdout);
      //var primes = stdout.split("\n").slice(0, -3).map(function (line) {return parseInt(line);});
      var text = stdout.replace(/(?:\r\n|\r|\n)/g, '');
      content=JSON.parse(text);
      callback(content);
    }
  );
}
exports.encrypt_text = function(text, keyfile, callback){
  var child = execFile(program, ["encrypt", crypttype, "text", text, keyfile ],
    function (error, stdout, stderr) {
      //console.log(stdout);
      
      var text = stdout.replace(/(?:\r\n|\r|\n)/g, '');
      callback(true, text);
    }
  );
}
exports.decrypt_text = function(text, keyfile, callback){
  var child = execFile(program, ["decrypt", crypttype, "text", text, keyfile ],
    function (error, stdout, stderr) {
      //console.log(stdout);
      
      callback(true, stdout);
    }
  );
}
exports.encrypt_file = function(fileinput, fileoutput, keyfile, callback){
  var child = execFile(program, ["encrypt", crypttype, "file", fileinput, fileoutput, keyfile],
    function (error, stdout, stderr) {
      //console.log(stdout);
      
      callback(true);
    }
  );
}
exports.decrypt_file = function(fileinput, fileoutput, keyfile, callback){
  var child = execFile(program, ["decrypt", crypttype, "file", fileinput, fileoutput, keyfile],
    function (error, stdout, stderr) {
      //console.log(stdout);
      
      callback(true);
    }
  );
}
exports.encode_file = function(keyfile, callback){
  var child = execFile(program, ["readbin", "base64", keyfile],
    function (error, stdout, stderr) {
      //console.log("encode_file " + keyfile + " result " + stdout);
      // var text = stdout.replace('\n','');
      // text = stdout.replace('\r','');
      // //event.sender.send('decrypt-file-finish', filename);
      // console.log(stdout);
      // console.log(text);
      var text = stdout.replace(/(?:\r\n|\r|\n)/g, '');

      callback(text);
    }
  );
}
exports.decode_file = function(text, keyfile, callback){
  var child = execFile(program, ["writebin", "base64", text, keyfile],
    function (error, stdout, stderr) {
      console.log(stdout);
      //var primes = stdout.replace("\n");
      //event.sender.send('decrypt-file-finish', filename);
      callback(stdout);
    }
  );
}
