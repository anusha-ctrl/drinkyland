// @flow
import React, { Component } from 'react';
import Tile from '../Components/Tile';
import Player from '../Components/Player';
import { Navbar, Nav } from 'react-bootstrap';

// Helpers
import Bartender from '../Helpers/Bartender.js';
import SyncDB from '../Helpers/SyncDB.js';

// Types
import type {syncState} from '../Helpers/SyncDB.js';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Game.scss';

const colorloop = ['rgb(148,14,173)','rgb(235,20,146)','rgb(237,148,44)','rgb(252, 198, 3)','rgb(76,183,53)','rgb(100,87,243)'];
const all_colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

type Props = {
  roomID: string,
  playerID: number,
  addr: string,
  syncDB: SyncDB,
}

type State = {
  ...syncState,
  available_colors: Array<string>,
  connected: boolean,
  cols: number,
}

class Game extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // Use the state from the remoteDB and keep it in sync on this component
    this.props.syncDB.syncState(this);

    this.state = {
      ...SyncDB.defaultState,
      available_colors: all_colors,
      connected: true, //TODO: Revert to false
      cols: this.getCols(window.innerWidth),
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  // Update the number of columns as the window size changes
  handleResize = () => {
    this.setState({
      cols: this.getCols(window.innerWidth)
    });
  };

  getCols(width: number){
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

  genTiles(actions: Array<string>, players: Array<any>, cols: number){
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
    // tbh Drinkyland gameplay is just a random number generator
    const roll = Math.floor(Math.random() * 6) + 1;
    const curr = this.state.curr_player;
    const next = (curr + 1) % this.state.players.length;
    var players : Array<any> = this.state.players;

    // Clear player move data from all players
    for (var id = 0; id < players.length; id++) {
      players[id]['just_moved'] = false;
      players[id]['is_next'] = false;
    }

    // Move the player and maintain the player tracking data
    var playerInfo = players[curr];
    playerInfo['pos'] = Math.min(playerInfo['pos'] + roll, this.state.actions.length-1);
    playerInfo['just_moved'] = true;
    players[curr] = playerInfo;

    players[next]['is_next'] = true;
    this.setState({
        players: players
    });

    // Broadcast the new state
    this.props.syncDB.setRoll(roll, next, players);
  }

  resetGame() {
    this.props.syncDB.resetGame();
  }

  render() {
    let player = this.state.players[this.state.curr_player] ?? {};
    let tiles = this.genTiles(this.state.actions, this.state.players, this.state.cols);

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
            {tiles}
          </div>
        </div>
      </div>
      }
    </>
    );
  }
}

export default Game;
