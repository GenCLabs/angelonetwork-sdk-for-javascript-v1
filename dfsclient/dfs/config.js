// const path = require('path');
// global.__baseDir = path.resolve();
// if (typeof global.__basedir === 'undefined')
//   global.__baseDir = process.cwd();//__dirname;
// console.log(global.__baseDir)
//var configpath = path.join('.dfsconfig.json')
//if (global.__baseDir != '/')
//  var configpath = path.join(global.__baseDir, '.dfsconfig.json')
//var json_cfg = require(configpath)
//var dfs_server = json_cfg.node_service;
//var auth_server = json_cfg.auth_service;
module.exports.readConfig = function(file){
  const path = require('path');
  //global.__baseDir = path.resolve();
  if (typeof global.__basedir === 'undefined')
  { 
    global.__baseDir = process.cwd();//__dirname;
    console.log(global.__baseDir);
  }
  //var configpath = path.join('.dfsconfig.json')
  //if (global.__baseDir != '/')
  var configpath = path.join(global.__baseDir, '.dfsconfig.json')
  var json_cfg = require(configpath)
  return json_cfg;
} //json_cfg //{dfs_server : dfs_server, auth_server: auth_server}