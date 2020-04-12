import React, { Component } from 'react';
import Tile from './Tile';
import './App.css';
import firebase from './firebase.js';

class App extends Component {
  tiles = [];

  constructor() {
    super();

    this.tiles = [];
    for (let i = 0; i < 50; i++){
      this.tiles.push(<Tile/>);
    }

    this.state = {
      playerVal: "trying to connect to firebase.."
    }
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
          <h1>DrinkyLand</h1>
          <p>{this.state.players}</p>
        </header>
        <div class="board">
          {this.tiles}
        </div>
      </div>
    );
  }
}

export default App;
