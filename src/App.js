import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebase.js'; // <--- add this line

class App extends Component {
  constructor() {
    super();
    this.state = {playerVal: 'local value here so far'}
  }

  componentDidMount() {
    const playersRef = firebase.database().ref('players');
    playersRef.on('value', (snapshot) => {
      let playerVal = snapshot.val();
      this.setState({
        players: playerVal
      });
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-logo">DrinkyLand</h1>
          <p>{this.state.players}</p>
        </header>
      </div>
    );
  }
}

export default App;
