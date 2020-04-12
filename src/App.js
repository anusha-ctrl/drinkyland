import React, { Component } from 'react';
import Tile from './Tile';
import './App.css';
import firebase from './firebase.js';


class App extends Component {
  tiles = [];

  constructor() {
    super();

    this.tiles = [];
    // Row 1
    for (let i = 0; i < 10; i++){
      this.tiles.push(<Tile action='drink' type='action'/>);
    }
    // Row 2
    for (let i = 0; i < 9; i++){
      this.tiles.push(<Tile type='empty'/>);
    }
    this.tiles.push(<Tile action='drink' type='action'/>);
    // Row 3
    for (let i = 0; i < 10; i++){
      this.tiles.push(<Tile action='drink' type='action'/>);
    }
    // Row 4
    this.tiles.push(<Tile action='drink' type='action'/>);
    for (let i = 0; i < 9; i++){
      this.tiles.push(<Tile type='empty'/>);
    }
    // Row 5
    for (let i = 0; i < 10; i++){
      this.tiles.push(<Tile action='drink' type='action'/>);
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
          <h1 className="App-logo">DrinkyLand</h1>
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
