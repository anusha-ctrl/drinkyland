// @flow
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import Tile from '../Components/Tile';
import Player from '../Components/Player';
import PlayerList from '../Components/PlayerList';

// Helpers
import Bartender from '../Helpers/Bartender.js';
import SyncDB from '../Helpers/SyncDB.js';
import Challenges from '../Helpers/Challenges.js'
import Donate from '../Helpers/Donate.js';

// Types
import type {syncState} from '../Helpers/SyncDB.js';

// Styling
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
  dismissed: boolean,
  modalShow: boolean,
}

class Game extends Component<Props, State> {
  playerID: number;
  playerRefs: any;
  tileRefs: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      ...SyncDB.defaultState,
      available_colors: all_colors,
      connected: false,
      dismissed: false,
      cols: this.getCols(window.innerWidth),
      modalShow: false,
    }

    this.playerRefs = [];
    this.tileRefs = [];
  }

  componentDidMount() {
    // Use the state from the remoteDB and keep it in sync on this component
    this.props.syncDB.syncState(this);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  componentDidUpdate(prevProps: Props, prevState: State, _: any){
    // Prep to show the new challenge description
    if(prevState.lastMove?.turnNumber !== this.state.lastMove?.turnNumber){
      this.setState({
        dismissed: false
      });

      // Scroll to the new tile position
      if(this.state.lastMove){
        const ref = this.tileRefs[this.state.lastMove.newPos];
        const node = findDOMNode(ref.current);
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  // Controls display of Disclaimer modal
  showModal() {
    this.setState({
      modalShow: true
    });
  };

  hideModal() {
    this.setState({
      modalShow: false
    });
  }

  // Donate Page
  openDonationPage() {
    window.open("https://secure.actblue.com/donate/ms_blm_homepage_2019");
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
    const {actions, players, cols, curr_player} = this.state;
    var bgcolor = '';
    var [actionIndex, i, j, tileIndex] = [0, 0, 0, 0];

    var tiles = [];

    // Initialize all the references we'll store
    for(i=0; i<players.length; i++){
      if(!this.playerRefs[i]){
        this.playerRefs[i] = React.createRef();
      }
    }
    for(i=0; i<actions.length; i++){
      if(!this.tileRefs[i]){
        this.tileRefs[i] = React.createRef();
      }
    }

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
          key={i}
          ref={this.playerRefs[i]}/>;
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
              syncDB={this.props.syncDB}
              ref={this.tileRefs[actionIndex]}/>);
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
              syncDB={this.props.syncDB}
              ref={this.tileRefs[actionIndex]}/>);
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
              syncDB={this.props.syncDB}
              ref={this.tileRefs[actionIndex]}/>);
          tileIndex += 1;
        }
      }
    }

    return tiles;
  }

  rollDice() {
    // Drinkyland gameplay is a random number generator + alcohol
    var roll = Math.floor(Math.random() * 6) + 1;

    // Increase challenge variability
    const { players, curr_player } = this.state;
    const playerPositions = players.map(p => p.pos);
    const currPos = players[curr_player].pos
    while(playerPositions.includes(currPos + roll) && Math.random() > 0.5){
      roll = Math.floor(Math.random() * 6) + 1;
    }
    this.props.syncDB.makeMove(roll, this.state.curr_player);
  }

  resetGame() {
    this.props.syncDB.resetGame();
  }

  dismissDescription() {
    this.setState({
      dismissed: true
    })
  }

  render() {
    let player = this.state.players[this.state.curr_player] ?? {};
    let tiles = this.genTiles();

    let description = null;
    // TODO: Turn this seed into a random string that's stored in lastTurn
    let seed = this.props.roomID + String(this.state.lastMove?.turnNumber);

    /* --- Description --- */
    let shouldShowDescription =
      !!this.state.lastMove &&
      this.state.players[this.state.lastMove.player].pos === this.state.lastMove.newPos &&
      !this.state.dismissed
    if(shouldShowDescription){
      let { lastMove, players, actions } = this.state;
      //$FlowFixMe Flow doesn't recognize that lastMove must be nonnull here
      let { newPos, player } = lastMove;
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
              className='game-btn transition-all'
              style={{color: color}}
              onClick={this.dismissDescription.bind(this)}>
              <div>Done</div>
            </div>
          </div>
        </div>
    }

    let startScreen = null;
    if(!this.state.started){
      startScreen =
        <div className="blackout">
          <PlayerList syncState={this.state} syncDB={this.props.syncDB}/>
        </div>
    }

    if (!this.state.connected){
      return <div className = "connecting-overlay"><h1>Connecting...</h1></div>;
    }

    return (
      <>
      <div className="App overflow-fix">
          <div className="status-bar">
            <Navbar className="outer-navbar" bg="dark" variant="dark" >
              <a href="/" className="logo">DrinkyLand</a>
              <Nav className="mr-auto">
                <Navbar.Text className="ml-10">Game Room ID: {this.props.roomID}</Navbar.Text>
                <Button variant="light" className="outer-nav-btn" onClick={() => this.resetGame()}>Reset Game</Button>
                <Button variant="warning" className="outer-nav-btn" onClick={() => this.showModal()}>Donate!</Button>
              </Nav>
            </Navbar>

            <Navbar className="inner-navbar second" >
              <Button variant="outline-dark" className="mr-10" onClick={() => this.rollDice()}>
                {this.props.playerID === this.state.curr_player ? 'Click me!' : 'Roll for them'}
              </Button>
              <Navbar.Text className="ml-10 mr-10"><strong>Roll:</strong> {this.state.lastMove?.roll} </Navbar.Text>
              <Navbar.Text className="ml-10 mr-10">
                <div className="curr_player_label"><strong>Current Player:</strong><p>{ player['name'] }</p>
                  {Bartender.pourImg(player.drink, { height: '20px', width: '20px'})}
                </div>
              </Navbar.Text>
              { this.state.lastMove &&
                <Navbar.Text>
                  <strong>Challenge: </strong>
                  { Challenges.format(this.state.actions[this.state.lastMove.newPos].description, this.state, seed) }
                </Navbar.Text>
              }
            </Navbar>
          </div>
          <div className="board">
            {tiles}
          </div>

          <Donate show={this.state.modalShow} onHide={() => this.hideModal()}/>

        {description}
        {startScreen}
        </div>

      </>
    );
  }
}

export default Game;
