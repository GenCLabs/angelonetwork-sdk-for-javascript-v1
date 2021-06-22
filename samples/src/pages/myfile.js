import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';


import classNames from 'classnames';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import List from '@material-ui/core/List';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import DesriptionIcon from '@material-ui/icons/Description';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ShareIcon from '@material-ui/icons/Share';
import pink from '@material-ui/core/colors/pink';
import green from '@material-ui/core/colors/green';

import Grid from '@material-ui/core/Grid';


import {Link, withRouter} from 'react-router-dom';
import FolderList from './folderlist';
import EnhancedTable from './enhancedtable';
import UsersDialog from './usersdialog';
import FolderView from './folderview';


const drawerWidth = 240;

const styles = theme => ({
  // root: {
  //   display: 'flex',
  // },
  // appBar: {
  //   transition: theme.transitions.create(['margin', 'width'], {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.leavingScreen,
  //   }),
  // },
  // appBarShift: {
  //   width: `calc(100% - ${drawerWidth}px)`,
  //   transition: theme.transitions.create(['margin', 'width'], {
  //     easing: theme.transitions.easing.easeOut,
  //     duration: theme.transitions.duration.enteringScreen,
  //   }),
  //   marginRight: drawerWidth,
  // },
  // menuButton: {
  //   marginLeft: 12,
  //   marginRight: 20,
  // },
  // hide: {
  //   display: 'none',
  // },
  // drawer: {
  //   width: drawerWidth,
  //   flexShrink: 0,
  // },
  // drawerPaper: {
  //   width: drawerWidth,
  // },
  // drawerHeader: {
  //   display: 'flex',
  //   alignItems: 'center',
  //   padding: '0 8px',
  //   ...theme.mixins.toolbar,
  //   justifyContent: 'flex-start',
  // },
  // content: {
  //   flexGrow: 1,
  //   //padding: theme.spacing.unit * 3,
  //   transition: theme.transitions.create('margin', {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.leavingScreen,
  //   }),
  //   marginRight: -drawerWidth,
  // },
  // contentShift: {
  //   transition: theme.transitions.create('margin', {
  //     easing: theme.transitions.easing.easeOut,
  //     duration: theme.transitions.duration.enteringScreen,
  //   }),
  //   marginRight: 0,
  // },
  // pinkBigAvatar: {
  //   margin: 10,
  //   color: '#fff',
  //   backgroundColor: pink[500],
  //   width: 100,
  //   height: 100,
  // },
  // greenBigAvatar: {
  //   margin: 10,
  //   color: '#fff',
  //   backgroundColor: green[500],
  //   width: 100,
  //   height: 100,
  // },
});

// function createData(id, name, size, modifieddate, carbs, protein) {
//   return { id, name, size, modifieddate, carbs, protein };
// }

class MyFile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: "123",
      password: "",
      data: [],
      selectedItem: null,
      open: false,
      openUserDialog: false,
      selectedUser: null,
    };

    //this.handleInputChange = this.handleInputChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
    //this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleSelectItem = this.handleSelectItem.bind(this);
    //this.handleUserDialogClose = this.handleUserDialogClose.bind(this);
  }
  

  // handleDrawerOpen = () =>{
  //   this.setState({ open: true });
  // };

  // handleDrawerClose = () => {
  //   this.setState({ open: false });
  // };
  componentDidMount(){
    if(window.require != null){
      //const {ipcRenderer} = require('electron')
      const electron = window.require('electron');
      const fs = electron.remote.require('fs');
      const ipcRenderer  = electron.ipcRenderer;
      // alert("myfile");
      if(document.getElementById('upload-file-button') != null)
        document.getElementById('upload-file-button').addEventListener('click', (event) => {  
          //alert("upload");
          ipcRenderer.send('upload-file')
        })
      ipcRenderer.on('upload-file-done', (event, obj) => {
        ipcRenderer.send('reload-files');
      })

      ipcRenderer.send('reload-files');
      ipcRenderer.on('reload-files-done', (event, obj) => {
        this.updateCurrentFolder(obj);
        // var items = [];
        // console.log("render");
        // if(obj != null && obj.info != null){
        //   //alert("reload done ok");
        //   console.log(obj);
        //   console.log("enhancetable: " + obj.info);          
        //   obj.info.childrenFolders.forEach(element => {
        //     items.push(element);
        //   });
        //   obj.info.childrenFiles.forEach(element => {
        //     items.push(element);
        //   });
        // }
        // let newdata = [];
        // for(var i = 0; i < items.length; i++){
        //    var f = items[i];
        //    f.isShared = false;
        //    newdata.push(f);
        //    //alert(f.name);
        // }
        // this.setState({data:newdata});

        // // //alert(this.state.data);
        // //console.log("my file reloadfiles done:");
        // //this.setState({data:obj});
      });

      ipcRenderer.on('new-folder-done', (event, obj) => {
        this.updateCurrentFolder(obj);
      });
      ipcRenderer.on('open-folder-done', (event, obj) => {
        this.updateCurrentFolder(obj);
      });
      
      function dodelete(file){
        ipcRenderer.send("delete-file",[file])
      }

      function share(file){
        ipcRenderer.send('share-file',[file])
      }

      // Tell main process to show the menu when demo button is clicked
      //const contextMenuBtn = document.getElementById('context-menu')
      function showMenu(data, ele){
        ipcRenderer.send('show-context-menu');
      }  
    }
  }
  updateCurrentFolder(currentfolder){
    var items = [];
    console.log("render");
    if(currentfolder != null && currentfolder.info != null){
      //alert("reload done ok");
      console.log(currentfolder);
      console.log("enhancetable: " + currentfolder.info);
      if(currentfolder.info.parent != ''){
        var {folderdfs} = require("@genclabs/dfsclient");
        items.push(folderdfs.newLinker(currentfolder.info.parent, "..", "folder"));
      }
      currentfolder.info.childrenFolders.forEach(element => {
        items.push(element);
      });
      currentfolder.info.childrenFiles.forEach(element => {
        items.push(element);
      });
    }
    let newdata = [];
    for(var i = 0; i < items.length; i++){
        var f = items[i];
        f.isShared = false;
        newdata.push(f);
        //alert(f.name);
    }
    this.setState({data:newdata});
  }
  shareFile = () => {
    this.handleUserDialogOpen();
    // const electron = window.require('electron');
    // const fs = electron.remote.require('fs');
    // const ipcRenderer  = electron.ipcRenderer;
    // ipcRenderer.send('share-file',[this.state.selectedItem])
  }
  // handleInputChange(event) {
  //   const target = event.target;
  //   const value = target.type === 'checkbox' ? target.checked : target.value;
  //   const name = target.name;

  //   this.setState({
  //     [name]: value
  //   });
  // }
  // handleEditing = () => {
  //   if(window.require != null)
  //   {
  //     //const {ipcRenderer} = require('electron')
  //     const electron = window.require('electron');
  //     const fs = electron.remote.require('fs');
  //     const ipcRenderer  = electron.ipcRenderer;
  //     //alert('login' + document.getElementById('email').value);
  //     //alert('login' + document.getElementById('password').value); 
  //     ipcRenderer.send('login',
  //       [document.getElementById('email').value,
  //       document.getElementById('password').value]);
  //   }
  // };
  // handleSubmit = (e) => {
  //   //alert("ok");
  //   this.handleEditing();
  //   e.preventDefault();
  // };
  handleSelectItem(selectedItems){
    if(selectedItems.length > 0){
      // var selectedData = this.state.data.find( function( f ){
      //   return f.id === selectedItems[0];
      // } );
      var selectedData = null;
      for(var i = 0; i < this.state.data.length; ++i)
        if(this.state.data[i].id == selectedItems[0]){
          selectedData = this.state.data[i];
        }
      if(selectedData != null){
        this.setState({selectedItem:selectedData});
        this.handleDrawerOpen();
      }
    }
  }
  doubleClickHandler(item){
    if(item.type=="folder"){
      const electron = window.require('electron');
      const fs = electron.remote.require('fs');
      const ipcRenderer  = electron.ipcRenderer;
      ipcRenderer.send('open-folder',[item]);
    }
  }
  handleAddFile (){
    const electron = window.require('electron');
    const fs = electron.remote.require('fs');
    const ipcRenderer  = electron.ipcRenderer;
    ipcRenderer.send('upload-file');
  }
  handleAddFolder (){
    const electron = window.require('electron');
    const fs = electron.remote.require('fs');
    const ipcRenderer  = electron.ipcRenderer;
    ipcRenderer.send('add-folder');
  }
  // handleUserDialogOpen = () => {
  //   this.setState({
  //     openUserDialog: true,
  //   });
  // };

  // handleUserDialogClose(value){
  //   // alert(value._id);
  //   // alert(this.state.openUserDialog);
  //   // alert(this.state.name);
  //   // this.setState({ selectedUser: value});
    
  //   //this.setState({name: "newname" });
  //   //alert(this.state.name);
  //   // alert(this.state.openUserDialog);
  //   // alert(this.state.selectedUser._id);
  //   if(value != null){
  //     const electron = window.require('electron');
  //     const fs = electron.remote.require('fs');
  //     const ipcRenderer  = electron.ipcRenderer;
  //     ipcRenderer.send('share-file-user',[this.state.selectedItem, value]);
  //   }
  //     this.setState({ selectedUser: value});
  //     this.setState({openUserDialog: false });
    
  // };
  render(){
    
    const { classes, theme, users } = this.props;
    const { open } = this.state;
    if(this.state.data == null){
      var {clientdfs} = require("@genclabs/dfsclient");
      this.setState({data:clientdfs.getCurrentFolder()})
    }
    console.log("myfile: " + this.state.data);
    return (
      <div className={classes.root}>
      <CssBaseline />
      <FolderView data={this.state.data} users={users} enableAdd="true" 
      addFileHandler={this.handleAddFile} 
      addFolderHandler={this.handleAddFolder} 
      selectItemHandler={this.handleSelectItem}
      doubleClickHandler={this.doubleClickHandler}/>
      </div>
    );
    // return (
    //   <div className={classes.root}>
    //   <CssBaseline />
    //   <AppBar
    //     position="fixed"
    //     className={classNames(classes.appBar, {
    //       [classes.appBarShift]: open,
    //     })}
    //   >
    //     <Toolbar disableGutters={!open}>
    //       <IconButton
    //         color="inherit"
    //         aria-label="Open drawer"
    //         onClick={this.handleDrawerOpen}
    //         className={classNames(classes.menuButton, open && classes.hide)}
    //       >
    //         <MenuIcon />
    //       </IconButton>
    //       <Typography variant="h6" color="inherit" noWrap>
    //         Persistent drawer
    //       </Typography>
    //     </Toolbar>
    //   </AppBar>
    //       <main
    //       className={classNames(classes.content, {
    //         [classes.contentShift]: open,
    //       })}
    //     >
        
    //     <EnhancedTable data={this.state.data} addItemHandler={this.handleAdd} selectItemHandler={this.handleSelectItem}/>
    //     </main>
    //     <Drawer
    //       className={classes.drawer}
    //       variant="persistent"
    //       anchor="right"
    //       open={this.state.open}
    //       classes={{
    //         paper: classes.drawerPaper,
    //       }}
    //     >
    //       <div className={classes.drawerHeader}>
    //         <IconButton onClick={this.handleDrawerClose}>
    //           {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    //         </IconButton>
    //       </div>
    //       <Divider />
    //       <div className={classes.drawerHeader}>
    //         <IconButton onClick={this.handleDrawerClose}>
    //           {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    //         </IconButton>
    //       </div>
    //       <div>            
    //         <Grid container justify="center" alignItems="center">
    //         <div>
    //                     <Avatar className={this.state.theme === "green" ? classes.greenBigAvatar : classes.pinkBigAvatar}>
    //                       <AssignmentIcon />
    //                     </Avatar>
    //                     </div></Grid>
    //                     <Grid container justify="center" alignItems="center">
    //                     {/* <DesriptionIcon/> */}
    //                     <div>
    //                     {this.state.selectedItem && this.state.selectedItem.filename}
    //                     </div>
    //         </Grid>
    //         <Grid container justify="center" alignItems="center">
    //                     {/* <DesriptionIcon/> */}
    //                     <div>
        
    //                     <Button variant="contained" color="secondary" className={classes.button} onClick={this.shareFile}>
    //     Share
    //     <ShareIcon className={classes.rightIcon} />
    //   </Button>
    //                     </div>
    //         </Grid>
    //       </div>
    //     </Drawer>
    //     <UsersDialog data={this.props.users}
    //       selectedValue={this.state.selectedValue}
    //       open={this.state.openUserDialog}
    //       onClose={this.handleUserDialogClose}
    //     />
    //     </div>
    // );
  }
}

MyFile.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(withRouter(MyFile));

