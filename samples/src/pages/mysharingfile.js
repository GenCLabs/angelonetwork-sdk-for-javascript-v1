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
import {Link, withRouter} from 'react-router-dom'
import FolderList from './folderlist'
import EnhancedTable from './enhancedtable'
import FolderView from './folderview';
import {folderdfs} from "@genclabs/dfsclient";

const styles = theme => ({
  main: {
    //width: 'auto',
    //display: 'block', // Fix IE 11 issue.
    // marginLeft: theme.spacing.unit * 3,
    // marginRight: theme.spacing.unit * 3,
    // [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
    //   width: 400,
    //   marginLeft: 'auto',
    //   marginRight: 'auto',
    // },
  },
  // paper: {
  //   marginTop: theme.spacing.unit * 8,
  //   display: 'flex',
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  // },
  // avatar: {
  //   margin: theme.spacing.unit,
  //   backgroundColor: theme.palette.secondary.main,
  // },
  // form: {
  //   width: '100%', // Fix IE 11 issue.
  //   marginTop: theme.spacing.unit,
  // },
  // submit: {
  //   marginTop: theme.spacing.unit * 3,
  // },
});

class MySharingFile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: "",
      password: "",
      data: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  updateCurrentFolder(currentfolder){
    var items = [];
    console.log("render");
    if(currentfolder != null && currentfolder.info != null){
      //alert("reload done ok");
      console.log(currentfolder);
      console.log("enhancetable: " + currentfolder.info);
      if(currentfolder.info.parent != ''){
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
        f.isShared = true;
        newdata.push(f);
        //alert(f.name);
    }
    this.setState({data:newdata});
  }
  componentDidMount(){
    if(window.require != null){
      //const {ipcRenderer} = require('electron')
      const electron = window.require('electron');
      const fs = electron.remote.require('fs');
      const ipcRenderer  = electron.ipcRenderer;
      

      ipcRenderer.send('reload-sharing-files');
      ipcRenderer.on('reload-sharing-files-done', (event, obj) => {
        if(obj == null)
          return;
        // let newdata = [];
        // for(var i = 0; i < obj.length; i++){
        //   var f = obj[i];
        //   f.isShared = true;
        //   newdata.push(f);          
        // }
        // this.setState({data:newdata});
        this.updateCurrentFolder(obj);
      });
      ipcRenderer.on('open-sharing-folder-done', (event, obj) => {
        this.updateCurrentFolder(obj);
      });
    }
  }
  download(file){
    const electron = window.require('electron');
    const fs = electron.remote.require('fs');
    const ipcRenderer  = electron.ipcRenderer;
    ipcRenderer.send('download-sharing-file',[file])
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }
  handleEditing = () => {
    if(window.require != null)
    {
      //const {ipcRenderer} = require('electron')
      const electron = window.require('electron');
      const fs = electron.remote.require('fs');
      const ipcRenderer  = electron.ipcRenderer;
      //alert('login' + document.getElementById('email').value);
      //alert('login' + document.getElementById('password').value); 
      ipcRenderer.send('login',
        [document.getElementById('email').value,
        document.getElementById('password').value]);
    }
  };
  handleSubmit = (e) => {
    //alert("ok");
    this.handleEditing();
    e.preventDefault();
  };
  doubleClickHandler(item){
    if(item.type=="folder"){
      const electron = window.require('electron');
      const fs = electron.remote.require('fs');
      const ipcRenderer  = electron.ipcRenderer;
      ipcRenderer.send('open-sharing-folder',[item]);
    }
  }
  render(){
    const { classes } = this.props;

    return (        
      <div className={classes.root}>
      <CssBaseline />
      <FolderView data={this.state.data} enableAdd="false" 
      selectItemHandler={this.handleSelectItem}
      doubleClickHandler={this.doubleClickHandler}/>
      </div>
    );
  }
}

MySharingFile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(MySharingFile));
  
