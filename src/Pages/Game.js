// @flow
import React, { Component } from 'react';
import Tile from '../Components/Tile';
import Player from '../Components/Player';
import { Navbar, Nav } from 'react-bootstrap';

// Helpers
import Bartender from '../Helpers/Bartender.js';
import SyncDB from '../Helpers/SyncDB.js';
import Challenges from '../Helpers/Challenges.js'

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
  syncDB: SyncDB,
}

type State = {
  ...syncState,
  available_colors: Array<string>,
  connected: boolean,
  cols: number,
}

class Game extends Component<Props, State> {
  playerID: number;

  constructor(props: Props) {
    super(props);

    this.state = {
      ...SyncDB.defaultState,
      available_colors: all_colors,
      connected: false,
      cols: this.getCols(window.innerWidth),
    }
  }

  componentDidMount() {
    // Use the state from the remoteDB and keep it in sync on this component
    this.props.syncDB.syncState(this);
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

  genTiles(){
    const {actions, players, cols, lastMove, curr_player} = this.state;
    var bgcolor = '';
    var [actionIndex, i, j, tileIndex] = [0, 0, 0, 0];

    var tiles = [];

    // Put players into a map from tile to players
    var playerMap = {};
    for (i=0; i<players.length; i++){
      var player = players[i];
      var pos = player['pos'];
      let comp =
        <Player
          location={player['pos']}
          name={player['name']}
          color={player['color']}
          drink={player['drink']}
          active={i === curr_player}
          key={i}/>;
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
          tiles.push(
            <Tile
              action={actions[actionIndex]}
              type='action'
              cols={cols}
              players={playerMap[actionIndex]}
              key={tileIndex}
              color={bgcolor}
              actionIndex={actionIndex}
              syncState={this.state}
              syncDB={this.props.syncDB}/>);
          tileIndex += 1;
        }
      }

      // Odd rows only have one tile
      // Every other odd row is on the left, the rest are on the right
      else {
        if (i%4 === 3){
          actionIndex = prior;
          bgcolor = colorloop[actionIndex%colorloop.length];
          tiles.push(
            <Tile
              action={actions[prior]}
              type='action'
              cols={cols}
              players={playerMap[actionIndex]}
              key={tileIndex}
              color={bgcolor}
              actionIndex={actionIndex}
              syncState={this.state}
              syncDB={this.props.syncDB}/>);
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
          tiles.push(
            <Tile
              action={actions[prior]}
              type='action'
              cols={cols}
              players={playerMap[actionIndex]}
              key={tileIndex}
              color={bgcolor}
              actionIndex={actionIndex}
              syncState={this.state}
              syncDB={this.props.syncDB}/>);
          tileIndex += 1;
        }
      }
    }

    return tiles;
  }

  rollDice() {
    // Drinkyland gameplay is a random number generator + alcohol
    const roll = Math.floor(Math.random() * 6) + 1;
    this.props.syncDB.makeMove(roll, this.state.curr_player);
  }

  resetGame() {
    this.props.syncDB.resetGame();
  }

  dismissDescription() {
    this.props.syncDB.dismissDescription();
  }

  render() {
    let player = this.state.players[this.state.curr_player] ?? {};
    let tiles = this.genTiles();

    let description = null;
    // TODO: Turn this seed into a random string that's stored in lastTurn
    let seed = this.props.roomID + String(this.state.lastMove?.turnNumber);
    if(this.state.lastMove?.dismissed === false){
      let { lastMove, players, actions } = this.state;
      //$FlowFixMe Flow doesn't realize lastMove must be nonnull
      let { newPos, turnNumber, player } = lastMove;
      let color = colorloop[newPos % colorloop.length];
      let challenge = actions[newPos];
      description =
        <div className='blackout description-container'>
          <div
            className='description'
            style={{background: color}}>
            <h2>{players[player].name}</h2>
            <h1>{challenge.title}</h1>
            <p>{Challenges.format(challenge.description, this.state, seed)}</p>
            <div
              className='btn transition-all'
              style={{color: color}}
              onClick={this.dismissDescription.bind(this)}>
              <div>Done</div>
            </div>
          </div>
        </div>
    }

    if (!this.state.connected){
      return <div className = "connecting-overlay"><h1>Connecting...</h1></div>;
    }

    return (
      <>
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
                {this.props.playerID === this.state.curr_player ? 'Click me!' : 'Roll for them'}
              </button>
              <Navbar.Text className="ml-10 mr-10"><strong>Roll:</strong> {this.state.lastMove?.roll} </Navbar.Text>
              <Navbar.Text className="ml-10 mr-10">
                <div className="curr_player_label"><strong>Current Player:</strong><p>{ player['name'] }</p>
                <img src={Bartender.pour(player['drink'])} alt={player['drink']} height="20px" width="20px"/></div>
              </Navbar.Text>
              { this.state.lastMove &&
                <Navbar.Text>
                  <strong>Challenge: </strong>
                  { Challenges.format(this.state.actions[this.state.lastMove.newPos].description, this.state, seed) }
                </Navbar.Text>
              }
          </Navbar>

          <div className="board">
            {tiles}
          </div>

          {description}
        </div>
      </>
    );
  }
}

export default Game;
