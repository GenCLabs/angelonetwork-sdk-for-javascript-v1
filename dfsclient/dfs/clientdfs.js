var auth = require("./auth")
var crypto = require("./crypto")
var storage = require("./storage")
var dfs = require("./dfs")
var folder = require("./folder");
const path = require('path');
const uuidv4 = require('uuid/v4')
var currentUser = null;
var userList = null;
var otherUserList = null;
var currentSharingFolder = null;
var rootSharingFolder = null;
var currentFolder = {linker : null, info : null};
const b64_suffix = ".__base64__";
var userMasterKeyCipherKey = null;

exports.initialize = function(){
  storage.initializeFolder();
}
exports.register = function(email, password, secretKey, callback){
  var seckey = email + "," + password;
  // if(secretKey){
  //   seckey = secretKey;
  // }
  crypto.genkey((keypair)=>{
    //crypto.encode_file(keyfile + ".key",(keystr)=>{
      //crypto.encode_file(keyfile + ".pub", (textkey)=>{
        auth.register(email, password, keypair.publicKey, (body)=>{
          //console.log(body);
          //console.log(body.user._id);
          currentUser = body.user;
          var key = { keytype:keypair.keyType, key:keypair.privateKey, pubkey:keypair.publicKey};
          storage.createUserDir(body.user);
          storage.copyKey(key);
          //storage.deleteKey(keyfile);
          createRootFolder(()=>{
            console.log("finish create root folder and callback to register");

            uploadMasterKey(seckey, ()=>{
              console.log("Upload master key finish");
              callback(body);
            });
          });
          
        })
      //});
    //});
  });
}
exports.login = function(email, password, callback){
  auth.login(email, password, (body)=>{
    //console.log(body);
    currentUser = body.user;
    storage.createUserDir(body.user);
    var key = storage.getMyMainKey();
    if(key == null)
    {
      crypto.derivekey(email+','+password, (keypair)=>{
        userMasterKeyCipherKey = keypair;
        recoverMasterKey((result)=>{
          console.log("Recover key success");
          reloadRootFolder((result)=>{});
        });
      });
      callback(body, true);
    }else{
      createRootFolder(()=>{
        // callback(body, key != null);
        callback(body, true);
      });
    }
  });  
}
exports.getCurrentUser = function(){
  return currentUser;
}
exports.getCurrentFolder = function(){
  return currentFolder;
}
var reloadRootFolder = function(callback){
  var folderLinker = storage.readRootFolder();
  if(folderLinker == null){
    console.log("No root folder");
    callback(false);
  }else{
    // read content
    openFolder(folderLinker, (folder)=>{
      currentFolder.info = folder;
      currentFolder.linker = folderLinker;
      console.log(currentFolder);
      callback(true);
    });
  }
}
var createRootFolder = exports.createRootFolder = function(callback){
  console.log("Create root folder");
  var folderLinker = storage.readRootFolder();
  if(folderLinker == null){
    console.log("No root folder");
    var newfolder = folder.newFolder("root", ""); 
    var tempfile = storage.getTempFile("root.json");
    storage.writeObj(tempfile, newfolder);
    console.log("create root folder to temp folder");
    currentFolder.info = newfolder;
    currentFolder.linker = folderLinker;
    console.log(currentFolder);
    uploadFile(tempfile, (id)=>{
      storage.createRootFolder(id);
      folderLinker = storage.readRootFolder();
      currentFolder.linker = folderLinker;
      uploadRootFolder(folderLinker, ()=>{
        console.log("Upload root folder finish");
        callback();
      });      
    })
  }else{
    // read content
    openFolder(folderLinker, (folder)=>{
      currentFolder.info = folder;
      currentFolder.linker = folderLinker;
      console.log(currentFolder);
      callback();
    });
  }
}
exports.reloadUsers=function(callback){
  auth.reloadUsers((body)=>{
    storage.writeUserList(body);
    var keys = Object.keys(body);
    userList = [];
    otherUserList = [];
    for(var i = 0; i < keys.length; i++){
      var key = keys[i];
      var user = body[key];
      userList.push(user);
      if(user.email != currentUser.email){
        otherUserList.push(user);
      }
    }
    callback(otherUserList);
  });
}

var uploadKey = function(keyobject, callback){
  var keyfile = storage.getMyMainKey();
  if(keyfile != null){
    var filestr = JSON.stringify(keyobject);
    console.log(filestr);
    console.log(keyfile);
    shareObject(keyobject, currentUser._id, keyfile.pubkey, callback);
  }
}
var uploadRootFolder = function(folderObj, callback){
  var metadata={ type: "rootfolder", data: folderObj};
  console.log("Upload rootfolder file :");
  console.log(metadata);
            
  var keyfile = storage.getMyMainKey();
  if(keyfile != null){
    var filestr = JSON.stringify(metadata);
    console.log(filestr);
    console.log(keyfile);
    shareObject(metadata, currentUser._id, keyfile.pubkey, callback);
  }
}
var decodeFile = function(textContent, callback){
  var keyfile = storage.getTempFile(uuidv4()+".pub");
  crypto.decode_file(textContent, keyfile, ()=>{
    callback(keyfile);
  });
}

var encodeFile = function(binaryFile, callback){
  crypto.encode_file(binaryFile,(keystr)=>{ callback(keystr); });
}

var uploadFile = exports.uploadFile=function(file, callback){
  //var keyname = uuidv4();
  //var keyfile = storage.getKeyFile(keyname);
  console.log("Gen key");
  crypto.genkey((keypair)=>{
    console.log("Gen temp file to encrypt");
    var encrypt_file_temp = storage.getTempFile(uuidv4());
    console.log("encrypted file " + encrypt_file_temp);
    crypto.encrypt_file(file, encrypt_file_temp, keypair.privateKey, 
      keypair.publicKey, ()=>{
      console.log("Encrypt file ok -> upload file " + encrypt_file_temp);
      dfs.upload(encrypt_file_temp, (file_id)=>{
        console.log("Upload ok -> encode key");
        //crypto.encode_file(keyfile + ".key",(keystr)=>{
          //crypto.encode_file(keyfile + ".pub", (pubkeystr)=>{
            //console.log("keystr" + keystr);
            //console.log("pubkeystr" + pubkeystr);
            console.log("encode key ok -> clear");
            var metadata={ type: "filekey", id : file_id, filename : path.basename(file), keytype:crypto.getEncryptionType(), 
            key : keypair.privateKey, pubkey : keypair.publicKey};
            console.log("Upload key file " + metadata);
            uploadKey(metadata,()=>{
              storage.addFile(metadata);
              storage.deleteFile(encrypt_file_temp);
              //storage.deleteKey(keyfile);
              console.log("callback upload ok");
              callback(file_id);
            });
          //})
        //})        
      });
    });
  });
}
var updateFile = exports.updateFile=function(id, newFilePath, callback){
  //var keyfile = storage.getTempFile(uuidv4()) + ".pub";
  //crypto.genkey(keyfile, (finished)=>{
  var file = storage.readFile(id);
  //console.log("write pubkey to file: " + keyfile);
  //crypto.decode_file(file.pubkey, keyfile , ()=>{
    //console.log("decode key ok -> encrypt");
    var encrypt_file_temp = storage.getTempFile(uuidv4());
    crypto.encrypt_file(newFilePath, encrypt_file_temp, "", file.pubkey, ()=>{
      console.log("encrypt ok -> update file " + id);
      dfs.update(id, encrypt_file_temp, (body)=>{
        //crypto.encode_file(keyfile + ".key",(keystr)=>{
          //crypto.encode_file(keyfile + ".pub", (pubkeystr)=>{
            //console.log("keystr" + keystr);
            //console.log("pubkeystr" + pubkeystr);
            //var metadata={ id : body, filename : path.basename(file), key : keystr, pubkey : pubkeystr};
            //storage.addFile(metadata);
            console.log("update ok -> clear")
            storage.deleteFile(encrypt_file_temp);
            //storage.deleteFile(keyfile);
            console.log("callback update ok");
            callback(body);
          //})
        //})        
      });
    });
  //});
}
var saveFolder = exports.saveFolder = function(folder, callback){
  var tempfile = storage.getTempFile(uuidv4());
  console.log("save current folder to file " + tempfile);
  storage.writeObj(tempfile, folder.info);
  console.log("update file to server ");
  updateFile(folder.linker.id, tempfile, ()=>{
    console.log("update file to server successfully");
    callback(folder);
  });    
}
exports.createSubFolder=function(folderName, callback){
  var parentFolder = currentFolder;
  
  console.log("No root folder");
  var newfolder = folder.newFolder(folderName, parentFolder.linker.id); 
  var tempfile = storage.getTempFile(uuidv4());
  storage.writeObj(tempfile, newfolder);
  console.log("create root folder to temp folder");  
  console.log("upload folder content ");
  uploadFile(tempfile, (id)=>{
    console.log("upload success with id " + id);
    console.log("add folder to current folder");
    folder.addFolderToFolder(id, folderName, parentFolder.info);
    
    saveFolder(parentFolder, (p)=>{callback(p);});
    // var tempfile = storage.getTempFile(uuidv4());
    // console.log("save current folder to file " + tempfile);
    // storage.writeObj(tempfile, parentFolder.info);
    // console.log("update file to server ");
    // updateFile(parentFolder.linker.id, tempfile, ()=>{
    //   console.log("update file to server successfully");
    //   callback(parentFolder);
    // });    
  })
  // create folder object
  // set parent folder property
  // save folder to file
  // use uploadFile function
  // save parentFolder to file
  // use updateFile function
  
}
exports.createSubFile=function(filepath, callback){
  var parentFolder = currentFolder;
  //var newfolder = folder.newFolder(folderName, parentFolder.id); 
  //var tempfile = storage.getTempFile(uuidv4());
  //storage.writeObj(tempfile, newfolder);  
  console.log("upload file content to ", parentFolder.info);
  uploadFile(filepath, (id)=>{
    console.log("upload success with id " + id);
    console.log("add folder to current folder");
    var finfo = storage.readFile(id);
    folder.addFileToFolder(id, finfo.filename, parentFolder.info);
    
    saveFolder(parentFolder, (p)=>{callback(p);});
    // var tempfile = storage.getTempFile(uuidv4());
    // console.log("save current folder to file " + tempfile);
    // storage.writeObj(tempfile, parentFolder.info);
    // console.log("update file to server ");
    // updateFile(parentFolder.linker.id, tempfile, ()=>{
    //   console.log("update file to server successfully");
    //   callback(parentFolder);
    // });    
  })
  // create folder object
  // set parent folder property
  // save folder to file
  // use uploadFile function
  // save parentFolder to file
  // use updateFile function
  
}
var openFolder = exports.openFolder=function(folderLinker, callback){
  if(storage.getMyMainKey() != null){
    // download folder by id
    var fid = folderLinker.id;
    console.log("open folder: " + fid);
    var finfo = storage.readFile(fid);
    if(finfo != null){
      var tempfile = storage.getTempFile(uuidv4());
      downloadFile(finfo, tempfile, (fname)=>{
        // parse folder content
        var folder = storage.readObj(tempfile);
        console.log("save folderinfo: " + tempfile);
        console.log("folderinfo: " + folder);
        callback(folder);
      });
    }else{
      callback(null);
    }
  }else{
    callback(null);
  }
}
exports.openParentFolder=function(folder, callback){
  // download folder by parent id
  // parse folder content
}
exports.reloadFiles=function(callback){
  //var files = storage.listFiles();
  // read content
  openFolder(currentFolder.linker, (folder)=>{
    currentFolder.info = folder;
    console.log("reloadfiles ok:" + currentFolder);
    callback(currentFolder);
  });  
}
exports.openFolderAndSetCurrent=function(folderLinker, callback){
  //var files = storage.listFiles();
  // read content
  openFolder(folderLinker, (folder)=>{
    currentFolder.info = folder;
    if(folderLinker.name == "..")
      folderLinker.name = folder.folderName;
    currentFolder.linker = folderLinker;
    console.log("reloadfiles ok:" + currentFolder);
    callback(currentFolder);
  });  
}
exports.openSharingFolderAndSetCurrent=function(folderLinker, callback){
  //var files = storage.listFiles();
  // read content
  openFolder(folderLinker, (folder)=>{
    if(folder != null){
      currentSharingFolder = {info : folder, linker : folderLinker};    
      if(folderLinker.name == "..")
        folderLinker.name = folder.folderName;
      console.log("reloadfiles ok:" + currentSharingFolder);
      callback(currentSharingFolder);
    }else if(folderLinker.name == ".."){
      currentSharingFolder = rootSharingFolder;
      callback(rootSharingFolder);
    }
  });  
}
exports.shareFile=function(fileLinker, receiver, callback){
  console.log("share file from " + currentUser._id + " to " + receiver._id + " file " + fileLinker);
  var finfo = storage.readFile(fileLinker.id);
  if(finfo!=null){
    var fileMsg = { type : "file", link : fileLinker, children : [finfo]};
    shareObject(fileMsg, receiver._id, receiver.publicKey, callback);  
  }
}
var shareObject = function(obj, receiverId, receiverPubkey, callback){
  
  var pubkey = receiverPubkey;
  //var keyfile = storage.getTempFile(uuidv4()+".pub");
  //crypto.decode_file(pubkey, keyfile, ()=>{
    console.log("Share " + obj + " from " + receiverId + " pub key:" + receiverPubkey);
    var filestr = JSON.stringify(obj);
    crypto.encrypt_text(filestr, "", pubkey, (result, encryptedText)=>{
      console.log("Encrypt object ok:" + encryptedText);
      auth.sendMessage( receiverId, encryptedText,(body)=>{
        console.log("Send message object finish ");
        //storage.deleteFile(keyfile);
        callback();
      });
    });
  //});
}
var shareObjectPlain = function(obj, receiverId, callback){
  //var pubkey = receiverPubkey;
  //var keyfile = storage.getTempFile(uuidv4()+".pub");
  //crypto.decode_file(pubkey, keyfile, ()=>{
    console.log("Share plain message" + obj + " from " + receiverId );
    var filestr = JSON.stringify(obj);
    var keystrb64 = Buffer.from(filestr).toString('base64') + ".__base64__";
    //crypto.encrypt_text(filestr, "", pubkey, (result, encryptedText)=>{
      //console.log("Encrypt object ok");
      auth.sendMessage( receiverId, keystrb64,(body)=>{
        console.log("Send message object finish ");
        //storage.deleteFile(keyfile);
        callback();
      });
    //});
  //});
}
function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}
async function getAllChildrenOfFolder(fo){
  console.log("Get for all children");
  var linkerQueue = [fo];
  //var folderList = [];
  // var items = folder.getChildren(fo.info);
  // items.forEach(element => {
  //   linkerQueue.push(element);
  // });
  var fileList = [];
  while(linkerQueue.length > 0){
    console.log("Loop for search linkerQueue.length=" + linkerQueue.length);
    if(linkerQueue.length > 0)
    {
      var l = linkerQueue[0];
      linkerQueue.shift();
      var finfo = storage.readFile(l.id);
      fileList.push(finfo);
      console.log("FileList size: " + fileList.length);
      if(l.type == "folder"){
        console.log("Add folder to search " + l.id);
        //folderList.push(l);
        // await openFolder(l, (folderinfo)=>{
        //   var folderChildren = folder.getChildren(folderinfo);
        //   folderChildren.forEach(element=>{
        //     linkerQueue.push(element);
        //   });
        //   folderList.filter(item => item != l);
        // });
        const folderinfo = await openFolderSync(l);
        var folderChildren = folder.getChildren(folderinfo);
        folderChildren.forEach(element=>{
          linkerQueue.push(element);
        });
        //folderList.filter(item => item != l);
      }
    }
  }
  console.log("FileList finish: " + fileList);
  return fileList;
}
function openFolderSync(folderLinker){
  return new Promise(resolve=>{
    openFolder(folderLinker, (folderinfo)=>{resolve(folderinfo)});
  })
}
exports.shareFolder= async function(folderLinker, receiver, callback){
  console.log("share folder from " + currentUser._id + " to " + receiver._id + " folder " + folderLinker.name);
  var folderMsg = { type : "folder", link : folderLinker, children : []};    
  var children = await getAllChildrenOfFolder(folderLinker);
  children.forEach(element=>{folderMsg.children.push(element)});
  shareObject(folderMsg, receiver, callback);
}

exports.reloadMessages = function(callback){
  auth.reloadMessages((msgobj)=>{    
    storage.writeUserList(msgobj);
    var keys = Object.keys(msgobj);
    console.log("keys:", keys);
    var sharedFolder = folder.newFolder("sharingFolder", "");
    rootSharingFolder = {info : sharedFolder, linker : null};
    for(var i = 0; i < keys.length; i++){
      var key = keys[i];
      var msg = msgobj[key];
      //console.log("msg:", msg);
      console.log("From:" ,msg.from);
      console.log("CurrentUser:" ,currentUser._id, " ?? ", msg.to);
      if(currentUser._id != msg.to)
      {
        console.log("next msg");
        continue;
      }
      if(currentUser._id == msg.to)
      {
        console.log("equal");
        console.log(msg.content);
      //sharingFileList.push(msg);
        //sharingFileList.push(msg);
        // decrypt message
        //var currentUserKeyFile = storage.getKeyFile("main.key");
        try{
          
        //var currentUserKeyFile = storage.getTempFile(uuidv4()+".key");
        //console.log("private key 2:" + currentUserKeyFile);
        //crypto.decode_file(privateKey, currentUserKeyFile, ()=>{
          if(msg.content.endsWith(b64_suffix)){
            plain_text = base64Decode(msg.content.substr(0, msg.content.length - b64_suffix.length));
            console.log("plain_text:" + plain_text);
            processPlainMessage(plain_text, sharedFolder);
          }
          else{
            var mainKey = storage.getMyMainKey();
            if(mainKey != null){
              var privateKey = mainKey.key;
              console.log("private key:" + privateKey);
              crypto.decrypt_text(msg.content, privateKey, "", (decrypt_result, plain_text)=>{
                processPlainMessage(plain_text, sharedFolder);
              });
            }
          }
          //});
        }catch(err){
          console.log(err);
        }
      }
    }
    reloadRootFolder((result)=>{});
    callback(rootSharingFolder);
  });
}

processPlainMessage = function(plain_text, sharedFolder){
  try{
    if(plain_text.trim() != ""){
    
      console.log("plain_message:" + plain_text);
    
      var sharingFile = JSON.parse(plain_text);
      if(sharingFile.type != null){
        if(sharingFile.type == "filekey"){
          storage.addFile(sharingFile);// sharing file as key
        }
        else if(sharingFile.type == "rootfolder"){
          storage.writeRootFolder(sharingFile.data);
        }
        else if(sharingFile.type == "masterkey"){
          console.log("Saving master key");
          storage.writeMainKeyCipher(sharingFile);
          if(storage.getMyMainKey() == null){
            recoverMasterKey((result)=>{
              console.log("Recover key success");
              reloadRootFolder((result)=>{});
            });
          }
        }else{
          //sharingFile.type == "folder"){
          // folder handler
          folder.addLinkerToFolder(sharingFile.link, sharedFolder);
          //sharingFileList.push(sharingFile.link);
          sharingFile.children.forEach(element=>{ storage.addFile(element);});
        }
      }else{
        var filelink_oldver = folder.newLinker(sharingFile.id, sharingFile.filename, "file");
        //sharingFileList.push(filelink_oldver);
        folder.addLinkerToFolder(sharingFile.link, sharedFolder);
        storage.addFile(sharingFile);
      }
    
    }
  }catch(err){
    console.log(err);
  }
}

exports.getRootSharingFolder = function(){
  return rootSharingFolder;
}
exports.downloadSharingFile = function(sharingFileLinker, filename, callback){
  //console.log("clientdfs download sharing");
  var sharingFile = storage.readFile(sharingFileLinker.id);
  if(sharingFile != null){
    var tempFile = storage.getTempFile(uuidv4());
    dfs.download(sharingFile.id, tempFile, (result)=>{
      //console.log("dfs download ok to " + tempFile);
      //var tempKey = storage.getTempFile(uuidv4());
      //crypto.decode_file(sharingFile.key, tempKey, ()=>{
        //console.log("crypto decode key to " + tempKey);
        crypto.decrypt_file(tempFile, filename, sharingFile.key, "", ()=>{
          //console.log("crypto decrypt file to " + filename);
          callback(filename);
        });
      //});
    });
  }
}
var downloadFile = exports.downloadFile = function(fileInfo, filename, callback){
  //console.log("clientdfs download sharing");
  var tempFile = storage.getTempFile(uuidv4());
  dfs.download(fileInfo.id, tempFile, (result)=>{
    //console.log("dfs download ok to " + tempFile);
    //var tempKey = storage.getTempFile(uuidv4());
    //crypto.decode_file(fileInfo.key, tempKey, ()=>{
      //console.log("crypto decode key to " + tempKey);
      crypto.decrypt_file(tempFile, filename, fileInfo.key, "", ()=>{
        //console.log("crypto decrypt file to " + filename);
        callback(filename);
      });
    //});
  });
}

exports.syncFileUpload = function(){
  // Upload main key

  // Upload key
}

exports.genSecretKey = function(length){
  return crypto.genSecretKey(length);
}
var base64Encode = function(keystr){
  return Buffer.from(keystr).toString('base64');
}
var base64Decode = function(b64){
  return Buffer.from(b64, 'base64').toString('ascii');
}
var uploadMasterKey = exports.uploadMasterKey = function(secretKey, callback){
  content = secretKey;
  console.log("Gen derive key");
  crypto.derivekey(content, (keypair)=>{
    console.log("Derive key pair " + keypair);
    mainkey = storage.getMyMainKey();
    var keystr = JSON.stringify(mainkey);
    var keystrb64 = base64Encode(keystr);//Buffer.from(keystr).toString('base64');
    crypto.encrypt_text_aes(keystrb64, keypair.privateKey, keypair.publicKey, (result, cipherText)=>{
      var masterkeyMsg = { type : "masterkey", cipher : cipherText, version : "1.0"};    
      console.log(masterkeyMsg);
      shareObjectPlain(masterkeyMsg, currentUser._id, callback);
    });
  });
}

var decryptMasterKey = function(keypair, cipherText, callback)
{
  crypto.decrypt_text_aes(cipherText, keypair.privateKey, keypair.publicKey, (result, plain_text)=>{
    var textcontent = base64Decode(plain_text);
    console.log(textcontent);
    var mainKeyObj = JSON.parse(textcontent);
    callback(mainKeyObj);
  });
}

var recoverMasterKey = function(callback){
  var mainkeycipher = storage.getMyMainKeyCipher();
  if(userMasterKeyCipherKey != null && mainkeycipher != null)
  {
    decryptMasterKey(userMasterKeyCipherKey, mainkeycipher.cipher, (mainKeyObj)=>{
      storage.copyKey(mainKeyObj);
      callback(true);
    });
  }
}