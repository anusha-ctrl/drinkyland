import React, { Component } from 'react';
import Tile from './Tile';
import './App.css';
import firebase from './firebase.js';

const actions = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'];

class App extends Component {
  tiles = [];

  constructor() {
    super();

    var cols = 10;
    var cur_action = '';

    this.tiles = [];
    // Generate each row
    for (var i = 0; i < actions.length*2/cols; i++){
      // The number of actions we've already shown in the past
      var prior = Math.ceil(i/2.0)*cols + Math.floor(i/2.0);

      // Even rows are all tiles
      if (i%2 == 0){
        for (var j=0; j < cols; j++){
          var actionIndex = prior + j;
          // sometimes we switch directions
          if (i%4 == 2){
            actionIndex = prior + cols - j - 1;
          }
          this.tiles.push(<Tile action={actions[actionIndex]} type='action' cols={cols}/>);
        }
      }

      // Odd rows only have one tile
      // Every other odd row is on the left, the rest are on the right
      else {
        if (i%4 == 3){
          this.tiles.push(<Tile action={actions[prior]} type='action' cols={cols}/>);
          for (var j=0; j < cols-1; j++){
            this.tiles.push(<Tile type='empty' cols={cols}/>);
          }
        } else {
          for (var j=0; j < cols-1; j++){
            this.tiles.push(<Tile type='empty' cols={cols}/>);
          }
          this.tiles.push(<Tile action={actions[prior]} type='action' cols={cols}/>);
        }
      }
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
