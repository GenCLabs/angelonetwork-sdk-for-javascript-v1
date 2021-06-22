import React, { Component } from 'react';
//import { Button, View, Text } from 'react-native';
//import { createAppContainer, createStackNavigator } from 'react-navigation'; // Version can be specified in package.json

import logo from './logo.svg';
import './App.css';
import Signin from './pages/signin';
import Register from './pages/register';
import RegisterPage from './registerpage';
import SigninPage from './signinpage';
import MainPage from './mainpage';
import EnhancedTable from "./pages/enhancedtable"
import { Switch, Route } from 'react-router-dom'
const Main = () => (
  <div>
    <Switch>
      <Route exact path='/' component={SigninPage}/>
      <Route path='/register' component={RegisterPage}/>
      <Route path='/main' component={MainPage}/>
      <Route path='/signin' component={SigninPage}/>
    </Switch>
  </div>
)

class App extends Component {
  render() {
    return (<div>
      {/* <EnhancedTable/> */}
      <div className="App">
        <header className="App-header">
        {/* <MainPage/> */}
        {/* <EnhancedTable/> */}
          <Main/>
          {/* <MainPage/> */}
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          {/* <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload. !!!
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a> */}
        </header>
      </div>
      </div>
    );
  }
}

export default App;
