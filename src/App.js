import React, { Component, useCallback} from 'react';
import Tile from './Tile';
import StatusBar from './StatusBar';
import './App.css';
import firebase from './firebase.js';
import { Button, Row, Navbar, Nav, Jumbotron } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


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
      playerVal: "trying to connect to firebase..",
      players : [],
      num_players: 5,
      curr_player: 0,
      available_colors: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
      all_colors: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
      roll: -1,
    }
  }

  rollDice() {
    // const index = this.state.curr_player;
    // const currPlayer = this.state.players[index];
    const roll = Math.floor(Math.random() * 6) + 1;
    const curr = this.state.curr_player;
    const next = (curr + 1) % this.state.num_players;
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
          <button onClick={() => this.rollDice()}>
            Click me!
          </button>
          <Navbar.Text>Roll: {this.state.roll} </Navbar.Text>
          <Navbar.Text>Current Player: { this.state.curr_player } </Navbar.Text>
        </Navbar>

        <div class="board">
          {this.tiles}
        </div>
      </div>
    </div>
    );
  }
}

export default App;
