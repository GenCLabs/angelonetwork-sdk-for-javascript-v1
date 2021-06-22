DFS Client library

##Installation

npm i @genclabs/dfsclient

###Usage

const {clientdfs} = require('@genclabs/dfsclient')

#### Initialize:

clientdfs.initialize();

#### Register user:

clientdfs.register(user, password);

#### Login:

clientdfs.login(user, password);

#### Reload users:

clientdfs.reloadUsers();

#### Reload sharing messages:

clientdfs.reloadMessages();

#### Create file inside current folder:

clientdfs.createSubFile(file);

#### Reload files:

clientdfs.reloadFiles();

#### Share file:

clientdfs.shareFile(file);

#### Share folder:

clientdfs.shareFolder(folder);

#### Download sharing file:

clientdfs.downloadSharingFile();

#### Create sub folder inside current folder:

clientdfs.createSubFolder(folder);

#### Open folder and set current:

clientdfs.openFolderAndSetCurrent(folder);

#### Open sharing folder and set current:

clientdfs.openSharingFolderAndSetCurrent(folder);

#### Get current folder:

clientdfs.getCurrentFolder();
