var request = require('request')
var config = require('./config')
const axios = require('axios');
const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

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
  console.log("auth send message to " + receiver + " content " + message);
  console.log(token)
  var body_content = { "message" : { "to" : receiver, "content" : message} };
  console.log(body_content)
  var filestr = JSON.stringify(body_content);
  console.log(filestr)
  // {
  //   //60 sec timeout
  //   timeout: 60000,
  
  //   //keepAlive pools and reuses TCP connections, so it's faster
  //   httpAgent: new http.Agent({ keepAlive: true }),
  //   httpsAgent: new https.Agent({ keepAlive: true }),
    
  //   //follow up to 10 HTTP 3xx redirects
  //   maxRedirects: 10,
    
  //   //cap the maximum content length we'll accept to 50MBs, just in case
  //   maxContentLength: 50 * 1000 * 1000
  axios.post(auth_server()+'/api/messages', body_content,
  {headers: {
    //'content-type': 'application/json',
    "Authorization":"Token " + token
  }, httpAgent: httpAgent, timeout: 60000, httpsAgent:httpsAgent,maxRedirects: 10,
  maxContentLength: 50 * 1000 * 1000})
  .then(function (response) {
    console.log(response);
    console.log(response.data);
    callback(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
  // request.post(
  //   {
  //     url : auth_server()+'/api/messages',    
  //     headers: {
  //       'content-type': 'application/json',
  //       "Authorization":"Token " + token
  //     },
  //     body : body_content,
  //     json: true
  //   },
  //   function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       //console.log(body);
  //       callback(body);
  //     }else{
  //       // console.log(response.statusCode);
  //       // console.log(response);
  //       // console.log(body);
  //     }
  //   }
  // );
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