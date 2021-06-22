import React, { Component } from 'react';
import Signin from './pages/signin';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    // display: 'flex',
    // background: '#000000'
  }
});

class SigninPage extends Component
{
  render(){
    const { classes, theme } = this.props;
    
    return (
      <div className="App">
        <header className="App-header">
          <Signin/>        
        </header>
      </div>
    );
  }
}

export default withStyles(styles)(SigninPage);

