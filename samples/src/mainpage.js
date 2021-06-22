import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
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
import SettingsIcon from '@material-ui/icons/Settings';
import FolderIcon from '@material-ui/icons/Folder';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import MyFile from './pages/myfile'
import MySharingFile from './pages/mysharingfile'

const drawerWidth = 240;
const drawerItemDetailWidth = 300;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing.unit * 3,
    //minWidth: 100
    // left: '0px',
    // right: '0px',
    // bottom: '0px',
    // top:'0px'
  },
  drawerItemDetail: {
    width: drawerItemDetailWidth,
    flexShrink: 0,
  },
  drawerItemDetailPaper: {
    width: drawerItemDetailWidth,
  },
  drawerItemDetailHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
});

class MainPage extends React.Component {
  state = {
    open: false,
    content: 'myfile',
    openItemDetail: false,
    users: [],
  };
  componentDidMount(){
    if(window.require != null){
      //const {ipcRenderer} = require('electron')
      const electron = window.require('electron');
      const fs = electron.remote.require('fs');
      const ipcRenderer  = electron.ipcRenderer;
      const path = require('path');
      function updateContent(viewName){
        const webview = document.querySelector('webview');
        var page = "file://" + path.join(__dirname , viewName);// "/myfile.html";
        //alert(page);
        webview = webview.loadURL(page);
      }
      // document.getElementById('my_file').addEventListener('click', (event) => {  
      //   updateContent('myfile.html');
      //   // const webview = document.querySelector('webview');
      //   // var page = "file://" + __dirname + "/myfile.html";
      //   // //alert(page);
      //   // webview = webview.loadURL(page);
      // })
      // document.getElementById('my_share_file').addEventListener('click', (event) => {  
      //   updateContent('mysharefile.html');
      //   // const webview = document.querySelector('webview');
      //   // var page = "file://" + __dirname + "/myfile.html";
      //   // //alert(page);
      //   // webview = webview.loadURL(page);
      // })
      ipcRenderer.send('get-current-user');
      ipcRenderer.on('get-current-user-done', (event, obj) => {
        if(obj != null)
          document.title += " | User " + obj.email;
      });
    
      ipcRenderer.on('reload-users-done', (event, obj) => {
        var keys = Object.keys(obj);
        var newusers = [];
        for(var i = 0; i < keys.length; i++){
          var key = keys[i];
          var user = obj[key];
          newusers.push(obj[key]);
          // var maindiv = $('#user_list');
          // var userdiv = $("<div/>",{"class":"btn"}).html(user.email);
          // userdiv.click({p1:user},function(e){			
          //   selectUser(e.data.p1,$(this));
          //   e.stopPropagation();});
          // maindiv.append(userdiv);
        }
        this.setState({users:newusers});
      });
      function selectUser(user, ele){
        updateContent("message.html");
      }
      
      ipcRenderer.on('reload-messages-done', (event, obj) => {
        //alert("done message");
      });
      function intervalFunc(){
        ipcRenderer.send('reload-users');
        ipcRenderer.send('reload-messages');
      }
      setInterval(intervalFunc, 10000);
    }
  }
  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleDrawerItemDetailOpen = () => {
    this.setState({ openItemDetail: true });
  };

  handleDrawerItemDetailClose = () => {
    this.setState({ openItemDetail: false });
  };

  handleOpenMyFile = () => {
    this.setState({ content: 'myfile'});
  };

  handleOpenMySharingFile = () => {
    this.setState({ content: 'mysharingfile'});
  };

  handleSignOut = () =>{
    this.props.history.push('/signin');
  }

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        {/* <MyFile/> */}
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: this.state.open,
          })}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, {
                [classes.hide]: this.state.open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              { this.state.content === 'myfile' ? 'My File' : 'My Sharing File'}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open,
          })}
          classes={{
            paper: classNames({
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open,
            }),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            {['My File', 'My Sharing File'].map((text, index) => (
              <ListItem button key={text} onClick={index % 2 === 0 ?this.handleOpenMyFile : this.handleOpenMySharingFile}>
                <ListItemIcon>{index % 2 === 0 ? <FolderIcon /> : <FolderSharedIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
           <List>
            {/* {['Settings','Sign Out'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <SettingsIcon /> : <ExitToAppIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))} */}
            {['Sign Out'].map((text, index) => (
              <ListItem button key={text} onClick={this.handleSignOut}>
                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List> 
        </Drawer>
        <div className={classes.content}>
          {/* <div className={classes.toolbar} /> */}
          {this.state.content === "myfile" ? <MyFile users={this.state.users}/> : <MySharingFile/>}
          
          {/* <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
            elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
            hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
            velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
            Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
            viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.
            Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus
            at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
            ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
          </Typography>  */}
          
        </div>
        {/* <Drawer
          className={classes.drawerItemDetail}
          variant="persistent"
          anchor="right"
          open={this.state.openItemDetail}
          classes={{
            paper: classes.drawerItemDetailPaper,
          }}
        >
          <div className={classes.drawerItemDetailHeader}>
            <IconButton onClick={this.handleDrawerItemDetailClose}>
              {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer> */}
      </div>
    );
  }
}

MainPage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MainPage);

// import React, { Component } from 'react';



// class MainPage extends Component
// {
//   render(){
//     return (
//       <div className="App">
//         <header className="App-header">
//           <ul class="nav tabs">
//                       <li class="" id="my_file"><a href="#tab1" data-toggle="tab"><h5 >My File</h5></a></li>
//                       <li class="" id="my_share_file"><a href="#tab2" data-toggle="tab"><h5 >My Sharing File</h5></a></li>                      
//           </ul>
//           Main
//         </header>
//       </div>
//     );
//   }
// }

// export default MainPage;
