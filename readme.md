# Build Linux instructions

## Step 1:  Install gn-node
This is required for building all the C++ example projects, including the addons.

```
npm install -g gn-node
```

## Step 2:  Build crypto
Update submodule projects
```
git submodule update --init
```
Run build script
```
cd cpp
./build.sh
```

## Step 3:  Copy crypto to client folder
Copy cpp/build/crypto to crypto-client/crypto/ or crypto-client-dfs/crypto folder  
```
cp cpp/build/crypto crypto-client/crypto/
cp cpp/build/crypto crypto-client-dfs/crypto/
```

# Build Windows instructions

## Step 1:  Build crypto.exe using Visual studio solution in cpp/windows

## Step 2:  Copy crypto.exe to client folder
Copy crypto.exe to crypto-client/crypto/ or crypto-client-dfs/crypto folder  

# Run crypto client
Go to crypto-client or crypto-client-dfs folder

```
npm install        
npm start
```

# Test scenario

## Uploading and sharing between 2 client

- Start client 1
```
cd crypto-client-dfs
npm start
```
register username 'a' and password 'b'

- Start client 2
same command with client 1, register username 'c' and password 'd'

- Client 1 upload a file in MyFile
- Client 1 share a file to client 2 in MyFile
- Client 2 see a sharing file in MySharingFile
- Client 2 download a sharing file

# Deploy client
Here a simple instruction to build app client for MacOS
```
cd crypto-client-dfs

# Install dependencies
npm install child-process --save
npm install fs --save
npm install path --save
npm install url --save
npm install child-process --save
npm install request --save

# Install packager
npm install electron-packager -g
electron-packager . Michelangelo --overwrite --icon=image_sq.icns

```

##################
# React App
# Development
Start react
```
npm run start-react
```
Start electron
```
npm run start-electron
```
# Deployment
```
# Build React
npm run build

# Install dependencies
npm install child-process --save
npm install fs --save
npm install path --save
npm install url --save
npm install child-process --save
npm install request --save

# Install packager
npm install electron-packager -g
electron-packager . Michelangelo --overwrite --icon=image_sq.icns
```
