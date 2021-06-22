const path = require('path');
var fs = require('fs');
var homename = ".angelonetwork";
var baseDir = path.join(require('os').homedir(),homename);//process.cwd();//__dirname;
var dataPath = path.join(baseDir,"data");
var currentUserPath = dataPath;
var currentUserKeyPath = dataPath;
var currentUserSharingFilePath = dataPath;
var currentUserFilePath = dataPath;
var folder = require("./folder");
var tempPath = path.join(baseDir, "tmp");
function createFolder(dir){  
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
}
function copyFile(filesrc, filedst){
  fs.copyFileSync(filesrc, filedst);
}
function deleteFile(file){
  fs.unlinkSync(file);
}
var writeObj = exports.writeObj = function(file, obj){
  fs.writeFileSync(file, JSON.stringify(obj), 'utf8');
}
var readObj = exports.readObj = function(file){
  return JSON.parse(fs.readFileSync(file));
}
exports.createFolder =  createFolder;
exports.copyFile = copyFile;
exports.deleteFile = deleteFile;

exports.initializeFolder = function(){
  createFolder(baseDir);
  createFolder(tempPath);
  createFolder(dataPath);  
}
exports.getTempFile = function(filename){
  return path.join(tempPath, filename);
}
exports.getKeyFile = function(filename){
  return path.join(currentUserKeyPath, filename);
}
exports.getUserFile = function(filename){
  return path.join(currentUserFilePath, filename);
}
exports.createUserDir = function(user){
  currentUserPath = path.join(dataPath, user.email);
  createFolder(currentUserPath);
  currentUserKeyPath = path.join(currentUserPath, "keys");
  createFolder(currentUserKeyPath);
  currentUserFilePath = path.join(currentUserPath, "files");
  createFolder(currentUserFilePath);
  currentUserSharingFilePath = path.join(currentUserPath, "sharingfiles");
  createFolder(currentUserSharingFilePath);
  createFolder(path.join(currentUserPath, "users"));
  writeObj(path.join(currentUserPath, "user.json"), user); 
}
exports.createRootFolder = function(id){
  //var newfolder = folder.newFolder("root", ""); 
  //writeObj(path.join(tempPath, "root.json"), newfolder);
  //newLinker
  //writeObj(path.join(currentUserPath, "rootFolder.json"), newfolder);
  var newLinker = folder.newLinker(id, "root", "folder");
  writeObj(path.join(currentUserPath, "rootFolder.json"), newLinker);
}
exports.readRootFolder = function(){
  try{
    var filepath = path.join(currentUserPath, "rootFolder.json");
    if(!fs.existsSync(filepath))
      return null;
    return readObj(filepath);
  }catch{
    return null;
  }
}
exports.writeUserList = function(userlist){
  writeObj(path.join(currentUserPath, "userlist.json"), userlist); 
}
exports.writeMessageList = function(messagelist){
  writeObj(path.join(currentUserPath, "messagelist.json"), messagelist); 
}
exports.copyKey = function(keyFile, keyObj){
  copyFile(keyFile + ".pub", path.join(currentUserKeyPath, "main.pub"));
  copyFile(keyFile + ".key", path.join(currentUserKeyPath, "main.key"));
  writeObj(path.join(currentUserKeyPath, "mainkey.key"), keyObj);
}
exports.getMyMainKey = function(){
  return JSON.parse(fs.readFileSync(path.join(currentUserKeyPath, "mainkey.key")));
}

exports.deleteKey = function(keyFile){
  deleteFile(keyFile + ".pub");
  deleteFile(keyFile + ".key");
}
exports.addFile = function(metadata){
  writeObj(path.join(currentUserFilePath, metadata.id + ".json"), metadata);
}
exports.addSharingFile = function(metadata){
  writeObj(path.join(currentUserSharingFilePath, metadata.id + ".json"), metadata);
}
exports.readFile = function(id){
  var filepath = path.join(currentUserFilePath, id + ".json");
  if(fs.existsSync(filepath))
    return readObj(filepath);
  else
    return null;
}
exports.listFiles = function(){
  var fileNamelist = fs.readdirSync(currentUserFilePath);
  var fileObjList = [];
  for(var i = 0; i < fileNamelist.length; i++){
    fileObjList.push(JSON.parse(fs.readFileSync(path.join(currentUserFilePath,fileNamelist[i]))));
  }
  //console.log(fileObjList);
  return fileObjList;
}