import React, { Component } from 'react';
import Tile from './Tile';
import Player from './Player';
import './App.scss';
import firebase from './firebase.js';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Bartender from './Bartender.js';

const colorloop = ['rgb(148,14,173)','rgb(235,20,146)','rgb(237,148,44)','rgb(252, 198, 3)','rgb(76,183,53)','rgb(100,87,243)'];
const all_colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actions: [],
      tiles: [],
      players : [],
      curr_player: 0,
      available_colors: all_colors,
      roll: -1,
      connected: false,
    }
  }

  handleResize = () => {
    // console.log(window.innerWidth);
    // console.log(this.state);
    this.setState({
      tiles: this.genTiles(this.state.actions, this.state.players, window.innerWidth)
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

  genTiles(actions, players, width){
    var cols = this.getCols(width);
    var bgcolor = 'rgb(0, 128, 128)';
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
    for (i = 0; i < actions.length/(cols+1)*2; i++){
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
          bgcolor = colorloop[actionIndex%colorloop.length];
          tiles.push(<Tile action={actions[actionIndex]} type='action' cols={cols} players={playerMap[actionIndex]} key={tileIndex} color={bgcolor}/>);
          tileIndex += 1;
        }
      }

      // Odd rows only have one tile
      // Every other odd row is on the left, the rest are on the right
      else {
        if (i%4 === 3){
          actionIndex = prior;
          bgcolor = colorloop[actionIndex%colorloop.length];
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
          bgcolor = colorloop[actionIndex%colorloop.length];
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
    var players = this.state.players;

    for (const id in players) {
      players[id]['just_moved'] = false;
      players[id]['is_next'] = false;
    }
    var playerInfo = players[curr];
    playerInfo['pos'] = Math.min(playerInfo['pos'] + roll, this.state.actions.length-1);
    playerInfo['just_moved'] = true;
    players[curr] = playerInfo;

    players[next]['is_next'] = true;
    this.setState({
        players: players
    });

    const ref = firebase.database().ref(this.props.addr+'/players');
    ref.set(this.state.players);

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
    var players = this.state.players;

    for (const key in players){
      players[key]['pos'] = 0;
    }

    this.setState({
      players: players
    });

    ref.set({
      actions: this.state.actions,
      players: this.state.players,
      curr_player: 0,
      roll: -1,
     });
  }

  componentDidMount() {
    const gameRef = firebase.database().ref(this.props.addr);
    gameRef.on('value', (snapshot) => {
      let gameState = snapshot.val();
      gameState['players'] = gameState['players'] ?? [];

      let merged = Object.assign({}, gameState, {tiles: this.genTiles(gameState['actions'], gameState['players'], window.innerWidth), connected:true});

      this.setState(merged);
    });

    const actionsRef = firebase.database().ref(this.props.addr+"/actions");
    actionsRef.on('value', (snapshot) => {
      this.setState({
        actions: snapshot.val()
      });
    });

    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  render() {
    let player = this.state.players[this.state.curr_player] ?? {};

    return (
      <>
      {!this.state.connected && <div className = "connecting-overlay"><h1>Connecting...</h1></div>}
      {this.state.connected &&
        <div>
        <Navbar bg="dark" variant="dark">
          <a href="/" className="logo">DrinkyLand</a>
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
      }
    </>
    );
  }
}

export default App;
