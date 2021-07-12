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

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class SignIn extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: "",
      password: "",
      requireMasterKey : false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount(){
    if(window.require != null){
      //const {ipcRenderer} = require('electron')
      const electron = window.require('electron');
      const fs = electron.remote.require('fs');
      const ipcRenderer  = electron.ipcRenderer;

      // document.getElementById('signin').addEventListener('click', (event) => { 
      //   //  alert('login');
      //   //  alert('login' + document.getElementById('input_email').value);
      //   //  alert('login' + document.getElementById('input_password').value); 
      //   ipcRenderer.send('login',
      //   [document.getElementById('input_email').value,
      //   document.getElementById('input_password').value]);
      // })

      // document.getElementById('registry').addEventListener('click', (event) => {  
      //     ipcRenderer.send('open-registry')
      //     window.close()    
      // })

      ipcRenderer.on('login-done', (event, path) => {
        // if (!path) path = 'No path'
        // document.getElementById('gen-file-saved').innerHTML = `Key pair save to: ${path}`
        // document.getElementById('load-key-pub').innerHTML = `${path}.pub`
        // document.getElementById('load-key-private').innerHTML = `${path}.key`
        //window.close()
        this.props.history.push('/main');
        
      });
      ipcRenderer.on('login-masterKey', (event, path)=>{
        
        this.setState({requireMasterKey: true});

      });
    }
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
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
  render(){
    const { classes } = this.props;
    const requireMasterKey = this.state.requireMasterKey;
    let secretKey;
    if (requireMasterKey) {
      secretKey = <FormControl margin="normal" required fullWidth>
      <InputLabel htmlFor="email">Secret key</InputLabel>
      <Input id="secretKey" name="secretKey" autoComplete="secretKey" autoFocus />
    </FormControl>;
    } else {
      secretKey = <FormControl margin="normal" required fullWidth>
    </FormControl>;;
    }
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
            </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input id="email" name="email" autoComplete="email" autoFocus />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input name="password" type="password"  id="password" autoComplete="current-password"  />
            </FormControl>
            {secretKey}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign in
              </Button>
            <Link to="register">Register</Link>
          </form>
        </Paper>
      </main>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(SignIn));