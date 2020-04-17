import React, { Component } from 'react';
import Tile from './Tile';
import Player from './Player';
import './App.scss';
import firebase from './firebase.js';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Bartender from './Bartender.js';

const actions = ['Start'].concat(Array.from({length: 65}, (_, i) => 'Drink '+ (i+2))).concat(['End']);
const colorloop = ['rgb(148,14,173)','rgb(235,20,146)','rgb(237,148,44)','rgb(252, 198, 3)','rgb(76,183,53)','rgb(100,87,243)'];
const all_colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

class App extends Component {
  constructor(props) {
    super(props);

    var initial_tiles = this.genTiles([]);

    this.state = {
      tiles: initial_tiles,
      players : [],
      curr_player: 0,
      available_colors: all_colors,
      roll: -1,
    }

    this.resetGame();
  }

  handleResize = () => {
    console.log(window.innerWidth);
    console.log(this.state);
    this.setState({
      tiles: this.genTiles(this.state.players, window.innerWidth)
    })
  };

  getCols(width){
    if(width < 450){
      return 3;
    }
    else if(width < 850){
      return 5;
    }
    else if(width < 1400){
      return 7;
    }
    return 10;
  }

  genTiles(players, width){
    var cols = this.getCols(width);
    var tiles = [];
    var actionIndex = -1;
    var i = 0;
    var j = 0;
    var tileIndex = 0;

    // Put players into a map from tile to players
    var playerMap = {};
    for (i=0; i<players.length; i++){
      var player = players[i];
      var pos = player['pos'];
      let comp = <Player location={player['pos']} name={player['name']} color={player['color']} drink={player['drink']} key={i}/>;
      var tileList = (playerMap[pos] ?? []);
      tileList.push(comp);
      playerMap[pos] = tileList;
    }

    // Generate each row
    for (i = 0; i < actions.length*2/cols; i++){
      // The number of actions we've already shown in the past
      var prior = Math.ceil(i/2.0)*cols + Math.floor(i/2.0);

      // Even rows are all tiles
      if (i%2 === 0){
        for (j=0; j < cols; j++){
          actionIndex = prior + j;
          // sometimes we switch directions
          if (i%4 === 2){
            actionIndex = prior + cols - j - 1;
          }
          var bgcolor = colorloop[actionIndex%colorloop.length];
          tiles.push(<Tile action={actions[actionIndex]} type='action' cols={cols} players={playerMap[actionIndex]} key={tileIndex} color={bgcolor}/>);
          tileIndex += 1;
        }
      }

      // Odd rows only have one tile
      // Every other odd row is on the left, the rest are on the right
      else {
        if (i%4 === 3){
          actionIndex = prior;
          var bgcolor = colorloop[actionIndex%colorloop.length];
          tiles.push(<Tile action={actions[prior]} type='action' cols={cols} players={playerMap[actionIndex]} key={tileIndex} color={bgcolor}/>);
          tileIndex += 1;
          for (j=0; j < cols-1; j++){
            tiles.push(<Tile type='empty' cols={cols} key={tileIndex}/>);
            tileIndex += 1;
          }
        } else {
          for (j=0; j < cols-1; j++){
            tiles.push(<Tile type='empty' cols={cols} key={tileIndex}/>);
            tileIndex += 1;
          }
          actionIndex = prior;
          var bgcolor = colorloop[actionIndex%colorloop.length];
          tiles.push(<Tile action={actions[prior]} type='action' cols={cols} players={playerMap[actionIndex]} key={tileIndex} color={bgcolor}/>);
          tileIndex += 1;
        }
      }
    }

    return tiles;
  }

  rollDice() {
    // const index = this.state.curr_player;
    // const currPlayer = this.state.players[index];
    const roll = Math.floor(Math.random() * 6) + 1;
    const curr = this.state.curr_player;
    const next = (curr + 1) % this.state.players.length;

    var playerInfo = this.state.players[curr];
    playerInfo['pos'] = playerInfo['pos'] + roll;
    const ref = firebase.database().ref(this.props.addr+'/players/'+curr);
    ref.set(playerInfo);
    firebase.database().ref(this.props.addr+'/curr_player').set(next);
    firebase.database().ref(this.props.addr+'/roll').set(roll);

    // const newLoc = currPlayer.location;
    // const color = currPlayer.color;
    // const name = currPlayer.name;
    // this.state.players[index] = {name : name, location : newLoc, color : color};
    return roll;
  }

  resetGame() {
    const ref = firebase.database().ref(this.props.addr);
    ref.set({
      players: {
         0: {pos: 0, color: 'red', name: 'Nami', drink: 'margarita'},
         1: {pos: 0, color: 'orange', name: 'Chillara', drink: 'wine'},
         2: {pos: 0, color: 'crimson', name: 'Pavi', drink: 'martini'},
         3: {pos: 0, color: 'blueviolet', name: 'Maya', drink: 'beer'},
         4: {pos: 0, color: 'blue', name: 'Mahima', drink: 'champagne'},
         5: {pos: 0, color: 'purple', name: 'Devdo', drink: 'whiskey'},
         6: {pos: 0, color: 'teal', name: 'Arka', drink: 'lemonade'}
       },
       curr_player: 0,
       roll: -1,
     });
  }

  componentDidMount() {
    const gameRef = firebase.database().ref(this.props.addr);
    gameRef.on('value', (snapshot) => {
      let gameState = snapshot.val();
      gameState['players'] = gameState['players'] ?? {};

      let merged = Object.assign({}, gameState, {tiles: this.genTiles(gameState['players'], window.innerWidth)});

      this.setState(merged);
    });

    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  render() {
    let player = this.state.players[this.state.curr_player] ?? {};

    return (
      <div>
      <Navbar bg="dark" variant="dark">
        <h1 className="logo">DrinkyLand</h1>
        <Nav className="mr-auto">
          <Navbar.Text className="ml-10">Game Room ID: {this.props.roomID}</Navbar.Text>
          <Nav.Link className="ml-10" onClick={() => this.resetGame()}>Reset Game</Nav.Link>
        </Nav>
      </Navbar>

      <div className="App">
        <Navbar className="inner-navbar">
            <button className="mr-10" onClick={() => this.rollDice()}>
              Click me!
            </button>
            <Navbar.Text className="ml-10 mr-10"><strong>Roll:</strong> {this.state.roll} </Navbar.Text>
            <Navbar.Text className="ml-10 mr-10">
              <div className="curr_player_label"><strong>Current Player:</strong><p>{ player['name'] }</p>
              <img src={Bartender.pour(player['drink'])} alt={player['drink']} height="20px" width="20px"/></div>
            </Navbar.Text>
        </Navbar>

        <div className="board">
          {this.state.tiles}
        </div>
      </div>
    </div>
    );
  }
}

export default App;
