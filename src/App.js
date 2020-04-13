import React, { Component, useCallback} from 'react';
import Tile from './Tile';
import './App.css';
import firebase from './firebase.js';
import { Button, Row, Navbar, Nav, Jumbotron } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const actions = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'];
const available_colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

class App extends Component {
  tiles = [];
  constructor() {
    super();

    var cols = 10;
    var cur_action = '';

    var initial_tiles = [];
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
          initial_tiles.push(<Tile action={actions[actionIndex]} type='action' cols={cols}/>);
        }
      }

      // Odd rows only have one tile
      // Every other odd row is on the left, the rest are on the right
      else {
        if (i%4 == 3){
          initial_tiles.push(<Tile action={actions[prior]} type='action' cols={cols}/>);
          for (var j=0; j < cols-1; j++){
            initial_tiles.push(<Tile type='empty' cols={cols}/>);
          }
        } else {
          for (var j=0; j < cols-1; j++){
            initial_tiles.push(<Tile type='empty' cols={cols}/>);
          }
          initial_tiles.push(<Tile action={actions[prior]} type='action' cols={cols}/>);
        }
      }
    }

    this.state = {
      playerVal: "trying to connect to firebase..",
      tiles: initial_tiles,
      players : [],
      curr_player: 0,
      all_colors: available_colors,
      roll: -1,
    }
  }

  rollDice() {
    // const index = this.state.curr_player;
    // const currPlayer = this.state.players[index];
    const roll = Math.floor(Math.random() * 6) + 1;
    const curr = this.state.curr_player;
    const next = (curr + 1) % this.state.players.length;
    this.setState({
      roll: roll,
      curr_player: next
    });

    console.log(this.state.roll);
    // const newLoc = currPlayer.location;
    // const color = currPlayer.color;
    // const name = currPlayer.name;
    // this.state.players[index] = {name : name, location : newLoc, color : color};
    return roll;
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
      <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav>
      </Navbar>




      <div className="App">
        <Navbar bg="light">
          <Nav className="mr-auto">
            <button className="mr-10" onClick={() => this.rollDice()}>
              Click me!
            </button>
            <Navbar.Text className="ml-10 mr-10"><strong>Roll:</strong> {this.state.roll} </Navbar.Text>
            <Navbar.Text className="ml-10 mr-10"><strong>Current Player:</strong> { this.state.curr_player } </Navbar.Text>
          </Nav>
        </Navbar>

        <div class="board">
          {this.state.tiles}
        </div>
      </div>
    </div>
    );
  }
}

export default App;
