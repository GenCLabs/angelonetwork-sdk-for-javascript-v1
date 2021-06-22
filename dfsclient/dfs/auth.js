var request = require('request')
var config = require('./config')
console.log(config)
var token = ""
var auth_server = function(){
  return config.readConfig().auth_service.url;
}
exports.register = function(email, password, pubkey, callback){
  request.post(
    {
      url : auth_server()+'/api/users',    
      headers: {'content-type': 'application/json'},
      body : {"user": { "email": email , "password": password , "publicKey": pubkey, "userType": "user"} },
      json: true
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log(body);
        token = body.user.token
        callback(body);
      }
    }
  );
}
exports.login = function(email, password, callback){  
  //console.log("login" + email + " " + password);
  request.post(
    {
      url : auth_server()+'/api/users/login',    
      headers: {'content-type': 'application/json'},
      body : {"user": { "email": email , "password": password} },
      json: true
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        console.log("token:" + body.user.token)
        token = body.user.token
        callback(body);
      }
    }
  );
}
// http://localhost:8000/api/users/usersList",
// 			"request": {
// 				"method": "GET",
// 				"header": [
// 					{
// 						"key": "Authorization",
// 						"value": "Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFiY0BnbWFpbC5jb20iLCJpZCI6IjVjNjk3MWQ4MjkzM2Y3MDM3MDM1OGI0NSIsImV4cCI6MTU1NTU5ODI5NiwiaWF0IjoxNTUwNDE0Mjk2fQ.6GmVMkiMJUNf1mkQlDOaFtZgsxPkshJQD8oBRStTjmQ",
// 						"type": "text"
// 					},
// 					{
// 						"key": "Content-Type",
// 						"value": "application/json",
// 						"type": "text"
exports.reloadUsers=function(callback){
  //console.log("reload users");
  //console.log(token)
  request.get(
    {
      url : auth_server()+'/api/users/usersList',    
      headers: {
        'content-type': 'application/json',
        "Authorization":"Token " + token
      },
      body : {},
      json: true
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log(body);
        callback(body);
      }
    }
  );
}

exports.sendMessage=function( receiver, message, callback){
  //console.log("auth send message from " + sender + " to " + receiver + " content " + message);
  //console.log(token)
  request.post(
    {
      url : auth_server()+'/api/messages',    
      headers: {
        'content-type': 'application/json',
        "Authorization":"Token " + token
      },
      body : { "message" : { "to" : receiver, "content" : message} },
      json: true
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log(body);
        callback(body);
      }
    }
  );
}
exports.reloadMessages=function(callback){
  //console.log("reload messages");
  //console.log(token)
  request.get(
    {
      url : auth_server()+'/api/messages/messagesList',    
      headers: {
        'content-type': 'application/json',
        "Authorization":"Token " + token
      },
      body : {},
      json: true
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //console.log(body);
        callback(body);
      }
    }
  );
}