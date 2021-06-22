var request = require('request')
var fs = require('fs')
var config = require('./config')
var dfs_server = function(){return config.readConfig().node_service.url;}

exports.upload = function(filename, callback){  
  //console.log("dfs begin upload file " + filename);
  var req = request.post(
    {
      url : dfs_server()+'/files',    
      // headers: {'content-type': 'application/json'},
      // body : {"user": { "email": email , "password": password , "publicKey": pubkey} },
      // json: true
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log(body);
        var content = body;
        //console.log(typeof body);
        if((typeof body)=="string"){          
          content=JSON.parse(content);
        }
        //console.log(content["ID"]);   
        callback(content["ID"]);        
      }
    }
  );
  var form = req.form();
  form.append('uploadfile', fs.createReadStream(filename));
}
exports.update = function(fileid, filename, callback){  
  //console.log("dfs begin upload file " + filename);
  var req = request.put(
    {
      url : dfs_server()+'/files/' + fileid,    
      // headers: {'content-type': 'application/json'},
      // body : {"user": { "email": email , "password": password , "publicKey": pubkey} },
      // json: true
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log(body);
        var content = body;
        //console.log(typeof body);
        if((typeof body)=="string"){          
          content=JSON.parse(content);
        }
        //console.log(content["ID"]);   
        callback(content["ID"]);        
      }
    }
  );
  var form = req.form();
  form.append('uploadfile', fs.createReadStream(filename));
}
exports.download = function(fileid, filesaved, callback){
  //console.log("dfs begin downloading file " + fileid);
  //console.log(dfs_server+'/files/'+fileid);
  // const file = fs.createWriteStream(filesaved);
  // request.get(
  //   {
  //     url : dfs_server+'/files/'+fileid,
  //   },
  //   function (error, response, body){
  //     if (!error && response.statusCode == 200) {
  //       var stream = response.pipe(file);
  //       stream.on('finish', function(){
  //         console.log("dfs download file finished");
  //         callback(true);
  //       });
  //     }
  //   }
  // )
  request(dfs_server()+'/files/'+fileid).pipe(fs.createWriteStream(filesaved)).on("finish", ()=>{
    //console.log("dfs download file finished");
    callback(true);
  });  
}