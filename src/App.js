import React, { Component, useCallback} from 'react';
import Tile from './Tile';
import Player from './Player';
import './App.css';
import firebase from './firebase.js';
import { Button, Row, Navbar, Nav, Jumbotron } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const actions = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'];
const all_colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

class App extends Component {
  constructor() {
    super();
    var initial_tiles = this.genTiles([]);

    this.state = {
      playerVal: "trying to connect to firebase..",
      tiles: initial_tiles,
      players : [],
      curr_player: 0,
      available_colors: all_colors,
      roll: -1,
    }
  }

  genTiles(players){
    var cols = 10;
    var cur_action = '';

    var tiles = [];

    // Put players into a map from tile to players
    var playerMap = {};
    for (var i=0; i<players.length; i++){
      var playerID = i;
      var player = players[i];
      var pos = player['pos'];
      let comp = <Player location={player['pos']} name={player['name']} color={player['color']}/>;

      var tileList = (playerMap[pos] ?? []);
      tileList.push(comp);
      playerMap[pos] = tileList;
    }

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
          tiles.push(<Tile action={actions[actionIndex]} type='action' cols={cols} players={playerMap[actionIndex]}/>);
        }
      }

      // Odd rows only have one tile
      // Every other odd row is on the left, the rest are on the right
      else {
        if (i%4 == 3){
          var actionIndex = prior;
          tiles.push(<Tile action={actions[prior]} type='action' cols={cols} players={playerMap[actionIndex]}/>);
          for (var j=0; j < cols-1; j++){
            tiles.push(<Tile type='empty' cols={cols}/>);
          }
        } else {
          for (var j=0; j < cols-1; j++){
            tiles.push(<Tile type='empty' cols={cols}/>);
          }
          var actionIndex = prior;
          tiles.push(<Tile action={actions[prior]} type='action' cols={cols} players={playerMap[actionIndex]}/>);
        }
      }
    }

    console.log(playerMap);

    return tiles;
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

    var playerInfo = this.state.players[curr];
    playerInfo['pos'] = playerInfo['pos'] + roll;
    const ref = firebase.database().ref('players/'+curr);
    ref.set(playerInfo);

    // const newLoc = currPlayer.location;
    // const color = currPlayer.color;
    // const name = currPlayer.name;
    // this.state.players[index] = {name : name, location : newLoc, color : color};
    return roll;
  }

  resetGame() {
    const ref = firebase.database().ref('players');
    ref.set({
       0: {pos: 0, color: 'red', name: 'Nami'},
       1: {pos: 0, color: 'orange', name: 'Chillara'},
       2: {pos: 0, color: 'crimson', name: 'Pavi'},
       3: {pos: 0, color: 'blueviolet', name: 'Maya'},
       4: {pos: 0, color: 'blue', name: 'Mahima'},
       5: {pos: 0, color: 'purple', name: 'Devdo'}
     });
     this.setState({
       curr_player: 0,
       roll: -1,
     })
  }

  componentDidMount() {
    const playersRef = firebase.database().ref('players');
    playersRef.on('value', (snapshot) => {
      let playersVal = snapshot.val();

      this.setState({
        players: playersVal,
        tiles: this.genTiles(playersVal)
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
            <Navbar.Text className="ml-10 mr-10"><strong>Current Player:</strong> { (this.state.players[this.state.curr_player]??{})['name'] } </Navbar.Text>
            <button className="mr-10" onClick={() => this.resetGame()}>
              Reset Game
            </button>
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
