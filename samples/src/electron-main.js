const {BrowserWindow, Menu, MenuItem} = require('electron')
const path = require('path')
const url = require('url')
const {clientdfs} = require('@genclabs/dfsclient')


let window = null

function showIndex(){}
function showLogin(){}
function showRegistry(){}
function showShare(){}
// function showIndex(){  
//   window = new BrowserWindow({
//     width: 800,    
//     height: 600,
//     backgroundColor: "#D6D8DC",
//     show: false,
//     icon: path.join(__dirname, "renderer/images/image_sq.png")
//   })
//   window.setMenu(null);
//   window.loadURL(url.format({
//     pathname: path.join(__dirname, 'renderer', 'index.html'),
//     protocol: 'file:',
//     slashes: true
//   }))

//   window.once('ready-to-show', () => {
//     window.show()
//   })
// }
// function showLogin(){  
//   const modalPath = path.join('file://', __dirname, 'renderer', 'login.html')
//   let win = new BrowserWindow({ width: 800, height: 600, icon: path.join(__dirname, "renderer/images/image_sq.png") })
//   win.setMenu(null);
//   win.on('close', () => { win = null })
//   win.loadURL(modalPath)
//   win.show()
// }
// function showRegistry(){  
//   const modalPath = path.join('file://', __dirname, 'renderer', 'registry.html')
//   let win = new BrowserWindow({ width: 800, height: 600, icon: path.join(__dirname, "renderer/images/image_sq.png") })
//   win.setMenu(null);
//   win.on('close', () => { win = null })
//   win.loadURL(modalPath)
//   win.show()
// }
// function showShare(){
//   const modalPath = path.join('file://', __dirname, 'renderer', 'sharefile.html')
//   let win = new BrowserWindow({width:400,height:300, icon: path.join(__dirname, "renderer/images/image_sq.png")});
//   win.setMenu(null);
//   win.on('close',()=>{win=null})
//   win.loadURL(modalPath)
//   win.show()
// }


var user = null;

// // Wait until the app is ready
// app.once('ready', () => {
//   clientdfs.initialize();
//   showLogin()
//   //showRegistry()
//   //showIndex()
// })
function readyApp(){
  clientdfs.initialize();
}


const {app, ipcMain, dialog} = require('electron')
app.on('ready', readyApp)
ipcMain.on('open-registry', (event)=>{showRegistry()})
ipcMain.on('open-signin', (event)=>{showLogin()})
ipcMain.on('register', (event,args)=>{  
  clientdfs.register(args[0],args[1], (obj)=>{
    user = obj;
    
    showIndex();
    event.sender.send('register-done', obj)
  });
});
ipcMain.on('login', (event,args)=>{
  clientdfs.login(args[0],args[1], (obj)=>{
    user = obj;
    
    showIndex();
    event.sender.send('login-done', obj)
  });
});
ipcMain.on('reload-users', (event) =>{
  clientdfs.reloadUsers((obj)=>{
    event.sender.send('reload-users-done',obj);
  });
});
ipcMain.on('reload-messages', (event) =>{
  clientdfs.reloadMessages((obj)=>{
    event.sender.send('reload-messages-done', obj);
  });
});  
ipcMain.on('get-current-user', (event)=>{
  event.sender.send('get-current-user-done', clientdfs.getCurrentUser());
});
ipcMain.on('upload-file', (event) =>{
  console.log('upload file');
  const options = {
    title: 'Select file to upload',
    // filters: [
    //   { name: 'Key', extensions: ['pub'] }
    // ]
  }
  dialog.showOpenDialog(options, (filename) => {
    //console.log(filename);
    if(filename != null && filename.length > 0){
      clientdfs.createSubFile(filename[0], (obj)=>{      
        event.sender.send('upload-file-done',obj);      
      });
    }
  })  
});

ipcMain.on('reload-files', (event) =>{
  console.log('reload-files');  
  clientdfs.reloadFiles((obj)=>{event.sender.send('reload-files-done',obj);});
});

// var selectedfile;
// var selecteduser;
// ipcMain.on('share-file', (event,args)=>{
//   selectedfile = args[0];
//   showShare();  
// });
// ipcMain.on('share-file-user', (event, args)=>{
//   selecteduser = args[0];
//   clientdfs.shareFile(selectedfile, selecteduser,(obj)=>{

//   });
// })
ipcMain.on('share-file-user', (event, args)=>{
  var selectedfile = args[0];
  var selecteduser = args[1];
  if(selectedfile.type == "file")
    clientdfs.shareFile(selectedfile, selecteduser,(obj)=>{});
  else
    clientdfs.shareFolder(selectedfile, selecteduser,(obj)=>{});
})

ipcMain.on('reload-sharing-files', (event) =>{
  event.sender.send('reload-sharing-files-done', clientdfs.getRootSharingFolder());
});

ipcMain.on('download-sharing-file', (event, args) =>{
  var dsf = args[0];
  const options = {
    title: 'Save sharing file',
    defaultPath : dsf.name,    
  }
  dialog.showSaveDialog((filename) => {
    console.log("save sharing file " + dsf.name + " to " + filename);
    clientdfs.downloadSharingFile(dsf, filename, ()=>{
      event.sender.send('download-sharing-file-done', filename);
    });
  })
});

ipcMain.on('new-folder', (event, args) =>{
  //console.log("save sharing file " + dsf.filename + " to " + filename);
  folderName = args[0];
  clientdfs.createSubFolder(folderName, (folder)=>{
    event.sender.send('new-folder-done', folder);
  });
});

ipcMain.on('open-folder', (event, args) =>{
  //console.log("save sharing file " + dsf.filename + " to " + filename);
  folder = args[0];
  clientdfs.openFolderAndSetCurrent(folder, (folder)=>{
    event.sender.send('open-folder-done', folder);
  });
});

ipcMain.on('open-sharing-folder', (event, args) =>{
  //console.log("save sharing file " + dsf.filename + " to " + filename);
  folder = args[0];
  clientdfs.openSharingFolderAndSetCurrent(folder, (folder)=>{
    event.sender.send('open-sharing-folder-done', folder);
  });
});

const menu = new Menu();
menu.append(new MenuItem({ label: 'Share' }));
menu.append(new MenuItem({ type: 'separator' }));
menu.append(new MenuItem({ label: 'Delete' }));
//menu.append(new MenuItem({ label: 'Delete', type: 'checkbox', checked: true }))

// app.on('browser-window-created', (event, win) => {
//   win.webContents.on('context-menu', (e, params) => {
//     menu.popup(win, params.x, params.y)
//   })
// })

ipcMain.on('show-context-menu', (event) => {
  console.log(event.sender);
  const win = BrowserWindow.fromWebContents(event.sender);
  console.log(win);
  menu.popup(win);
})

ipcMain.on('save-dialog', (event) => {
  //alert("open dialog")
  // const options = {
  //   title: 'Save an Image',
  //   filters: [
  //     { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
  //   ]
  // }
  dialog.showSaveDialog((filename) => {
    console.log("begin generate key ...");
    var execFile = require('child_process').execFile
    var program = "../cpp/build/crypto";
    //var under = parseInt(req.body.under);
    var child = execFile(program, ["genkey", "ecc", filename + ".key", filename + ".pub"],
      function (error, stdout, stderr) {
        console.log(stdout);
        var primes = stdout.split("\n").slice(0, -3).map(function (line) {return parseInt(line);});
      }
    );
    event.sender.send('saved-file', filename)
  })
})
ipcMain.on('load-key-dialog', (event) => {
  //alert("open dialog")
  const options = {
    title: 'Load private key',
    filters: [
      { name: 'Key', extensions: ['key'] }
    ]
  }
  dialog.showOpenDialog(options, (filename) => {
    console.log("load private key ...");
    event.sender.send('load-key-file', filename)
  })
})
ipcMain.on('load-pub-key-dialog', (event) => {
  //alert("open dialog")
  const options = {
    title: 'Load public key',
    filters: [
      { name: 'Key', extensions: ['pub'] }
    ]
  }
  dialog.showOpenDialog(options, (filename) => {
    console.log("load private key ...");
    event.sender.send('load-pub-key-file', filename)
  })
})
/// encrypt text
ipcMain.on('encrypt-text', (event, args) => {
  //alert("open dialog")
  console.log(args[0]);
  console.log(args[1]);
  var execFile = require('child_process').execFile
    var program = "../cpp/build/crypto";
    //var under = parseInt(req.body.under);
    var child = execFile(program, ["encrypt", "ecc", "text", args[0], args[1] ],
      function (error, stdout, stderr) {
        console.log(stdout);
        var primes = stdout.split("\n").slice(0, -3).map(function (line) {return parseInt(line);});
        event.sender.send('encrypt-text-finish', stdout)
      }
    );
  
})
/// encrypt text
ipcMain.on('decrypt-text', (event, args) => {
  //alert("open dialog")
  console.log("decrypt-text");
  console.log(args[0]);
  console.log(args[1]);
  var execFile = require('child_process').execFile
    var program = "../cpp/build/crypto";
    //var under = parseInt(req.body.under);
    var child = execFile(program, ["decrypt", "ecc", "text", args[0], args[1] ],
      function (error, stdout, stderr) {
        console.log(stdout);
        var primes = stdout.split("\n").slice(0, -3).map(function (line) {return parseInt(line);});
        event.sender.send('decrypt-text-finish', stdout)
      }
    );
  
})
/// encrypt file
ipcMain.on('load-file-plain-dialog', (event) => {
  //alert("open dialog")
  // const options = {
  //   title: 'Load private key',
  //   filters: [
  //     { name: 'Key', extensions: ['key'] }
  //   ]
  // }
  dialog.showOpenDialog((filename) => {
    console.log("load file plain ...");
    event.sender.send('load-file-plain', filename)
  })
})
ipcMain.on('encrypt-file', (event, args) => {  
  const options = {
     title: 'Save a file',
     filters: [
       { name: 'EncryptedFile', extensions: ['enc'] }
     ]
  }
  dialog.showSaveDialog(options, (filename) => {
    console.log("begin encrypt file ...");
    console.log(args[0])
    console.log(args[1])
    var execFile = require('child_process').execFile
    var program = "../cpp/build/crypto";
    //var under = parseInt(req.body.under);
    var child = execFile(program, ["encrypt", "ecc", "file", args[0], filename, args[1]],
      function (error, stdout, stderr) {
        console.log(stdout);
        var primes = stdout.split("\n").slice(0, -3).map(function (line) {return parseInt(line);});
        event.sender.send('encrypt-file-finish', filename);
      }
    );    
  })  
})

// Decrypt
ipcMain.on('load-file-encrypted-dialog', (event) => {
  //alert("open dialog")
  const options = {
    title: 'Load encrypted file',
    filters: [
      { name: 'EncryptedFile', extensions: ['enc'] }
    ]
  }
  dialog.showOpenDialog(options, (filename) => {
    console.log("load file encrypted ...");
    event.sender.send('load-file-encrypted', filename)
  })
})
ipcMain.on('decrypt-file', (event, args) => {  
  const options = {
     title: 'Save a file',
     filters: [
       { name: 'DecryptedFile', extensions: ['plain'] }
     ]
  }
  dialog.showSaveDialog(options, (filename) => {
    console.log("begin decrypt file ...");
    console.log(args[0])
    console.log(args[1])
    var execFile = require('child_process').execFile
    var program = "../cpp/build/crypto";
    //var under = parseInt(req.body.under);
    var child = execFile(program, ["decrypt", "ecc", "file", args[0], filename, args[1]],
      function (error, stdout, stderr) {
        console.log(stdout);
        var primes = stdout.split("\n").slice(0, -3).map(function (line) {return parseInt(line);});
        event.sender.send('decrypt-file-finish', filename);
      }
    );    
  })  
})
