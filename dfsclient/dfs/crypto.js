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

exports.genkey = function(callback){
  var child = execFile(program, ["genkeyText", crypttype],
    function (error, stdout, stderr) {
      console.log(stdout);
      //var primes = stdout.split("\n").slice(0, -3).map(function (line) {return parseInt(line);});
      var text = stdout.replace(/(?:\r\n|\r|\n)/g, '');
      content=JSON.parse(text);
      callback(content);
    }
  );
}
exports.derivekey = function(text, callback){
  var child = execFile(program, ["derivekey", text],
    function(error, stdout, stderr){
      console.log(stdout);
      var text = stdout.replace(/(?:\r\n|\r|\n)/g, '');
      content=JSON.parse(text);
      callback(content);
    }
  );
}
exports.genSecretKey = function(length) {
  var result           = '';
  //var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
  }
 return result;
}
exports.encrypt_text = function(text, privateKeyFile, publicKeyFile, callback){
  var child = execFile(program, ["textkeyencrypt", crypttype, "text", text, privateKeyFile, publicKeyFile ],
    function (error, stdout, stderr) {
      //console.log(stdout);
      var text = stdout.replace(/(?:\r\n|\r|\n)/g, '');
      
      callback(true, text);
      
    }
  );
}

exports.decrypt_text = function(text, privateKeyFile, publicKeyFile, callback){
  params = ["textkeydecrypt", crypttype, "text", text, privateKeyFile, publicKeyFile ];
  console.log(params)
  var child = execFile(program, params,
    function (error, stdout, stderr) {
      //console.log(stdout);
      
        callback(true, stdout);
      
    }
  );
}

exports.encrypt_text_aes = function(text, privateKeyFile, publicKeyFile, callback){
  var params = ["textkeyencrypt", 'aes', "text", text, privateKeyFile, publicKeyFile ];
  console.log(params);
  var child = execFile(program, params,
    function (error, stdout, stderr) {
      //console.log(stdout);
      var text = stdout.replace(/(?:\r\n|\r|\n)/g, '');
      
      callback(true, text);
      
    }
  );
}

exports.decrypt_text_aes = function(text, privateKeyFile, publicKeyFile, callback){
  params = ["textkeydecrypt", 'aes', "text", text, privateKeyFile, publicKeyFile ];
  console.log(params)
  var child = execFile(program, params,
    function (error, stdout, stderr) {
      //console.log(stdout);
      
        callback(true, stdout);
      
    }
  );
}
exports.encrypt_file = function(fileinput, fileoutput, privateKeyFile, publicKeyFile, callback){
  var params = ["textkeyencrypt", crypttype, "file", fileinput,
  fileoutput, privateKeyFile, publicKeyFile];
  console.log(params);
  var child = execFile(program, params,
    function (error, stdout, stderr) {
      //console.log(stdout);
      
      callback(true);
    }
  );
}
exports.decrypt_file = function(fileinput, fileoutput, privateKeyFile, publicKeyFile, callback){
  var child = execFile(program, ["textkeydecrypt", crypttype, "file", fileinput,
   fileoutput, privateKeyFile, publicKeyFile],
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
