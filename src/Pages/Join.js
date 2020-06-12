//@flow
import React, {Component} from "react";
import {Form, Button } from 'react-bootstrap';
import firebase from '../Helpers/firebase.js';
import Challenges from '../Helpers/Challenges.js';
import Disclaimer from '../Helpers/Disclaimer.js';


// Styling
import '../css/Signin.scss';

type State = { 
  game_button : string, 
  modalShow : boolean, 
  actions : string, 
  active: bool, 
}

type Props = {
  roomID: string,
  type: string,
  syncDB: SyncDB,
}

const initial_state = {
  actions: Challenges.getDefaults(),
  players: {},
  curr_player: 0,
  started: false,
 }

 const CREATE = "Create Game!";
 const JOIN = "Join Game!";


 export default class Join extends Component<Props, State>{
  constructor(props : Props) {
      super(props);
      this.state = {
        game_button : CREATE,
        modalShow: false,
        actions: initial_state.actions.slice(1,-1).map(function (tile) { return tile.title; }).join(", "),
        active: false,
      };

      if (this.props.type === "join") {
        this.state.game_button = JOIN;
      }
  }

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

  generateRoomID() {
    return Math.floor(Math.random() * (10000));
  }


  updateTiles(tiles_str : string) {
    var old_tiles = initial_state.actions;
    const new_tiles = tiles_str.split(", ");
    const old_len = old_tiles.length;
    const end = old_tiles[old_len-1];

    for (var i = 0; i < new_tiles.length; i++) {
      if (i <= old_len && old_tiles[i+1].title !== new_tiles[i]) {
        old_tiles[i+1] = {title: new_tiles[i], description: new_tiles[i]};
      } else {
        old_tiles.push({title: new_tiles[i], description: new_tiles[i]});
      }
    }

    if (old_len < old_tiles.length) {
      old_tiles.push(end);
    }

    initial_state.actions = old_tiles;
  }

  handleClick(event : any) {
    const status = this.state.active;
    this.setState({
      active: !status
    });
  }

  // Handles onChange function for Custom Tiles input
  handleOnChange(event : any) {
    event.preventDefault();
    const new_tiles = event.target.value;
    this.setState({
      actions: new_tiles,
    });
  }

  // Submits form
  handleSubmit(event: any) {
    var roomID = this.props.roomID;
    var name = event.target.name.value;
    var drink = {glass: event.target.glass.value, liquid: '#000000', topping: event.target.topping.value};
    var tiles = event.target.tiles.value;

    this.updateTiles(tiles);

    // Generate a room id for them if they didn't provide one
    if (roomID === null || roomID === '' || roomID === undefined) {
      roomID = this.generateRoomID().toString();
    }

    // If this room doesn't exist yet, initialize it
    const gameRef = firebase.database().ref("games/"+roomID);
    gameRef.once('value', (snapshot) => {
      var playerIndex = 0;
      if (!snapshot.exists()){
        gameRef.set({
          ...initial_state,
          players: {
            '0': {pos: 0, color: 'nah', name: name, drink: drink}
          }
        });
      } else if (this.props.type === "create") {
          gameRef.set({
            players: {
              '0': {pos: 0, color: 'nah', name: name, drink: drink}
            }
          });  
      } else {
        // Add the player if they don't already exist
        const players = snapshot.val()['players'];
        playerIndex = players.findIndex((p) => p.name === name);
        if (playerIndex === -1) {
          var playerLen = players.length;
          let playerObj = {}
          playerObj[playerLen] = {pos: 0, color: 'nah', name: name, drink: drink}
          gameRef.child('players').update(playerObj);
          playerIndex = playerLen;
        }
      }

      this.props.cookies.set(roomID, playerIndex, { path: '/'});
      this.props.history.push('/room/'+roomID);

    });

    event.preventDefault();
  }

  render() {
    return (
      <div className="signin-parent">
        <div className="signin-container">
          <h1 className="logo">DrinkyLand</h1>

          <Form onSubmit={this.handleSubmit.bind(this)}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control required type="text" placeholder="Enter your name"/>
            </Form.Group>
            <Form.Group controlId="glass">
              <Form.Label>Pick a drink</Form.Label>
              <Form.Control required as="select">
                <option>martini</option>
                <option>beer</option>
                <option>regular</option>
                <option>fishbowl</option>
                <option>whiskey</option>
                <option>wine</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="topping">
              <Form.Label>Pick a topping</Form.Label>
              <Form.Control required as="select">
                <option>olive</option>
                <option>lime</option>
                <option>gummy_worms</option>
                <option>straw</option>
              </Form.Control>
            </Form.Group>
            <Form.Group style={{ display : (this.props.type === "create" ? 'block' : 'none')}} controlId="customCheck">
              <Form.Check 
                type="checkbox" 
                checked={this.state.active}
                onChange={this.handleClick.bind(this)}
                label="Click here if you would like to customize your game." />
            </Form.Group>
            <Form.Group controlId="tiles">
              <div style={{ display: (this.state.active && this.props.type === "create" ? 'block' : 'none') }}>
                <Form.Label id="custom-label">Customize tile messages by switching ours with your own! Separate with commas.</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows="3" 
                  placeholder="Custom Tile Messages" 
                  onChange={this.handleOnChange.bind(this)}
                  value={ this.state.actions }
                />
              </div>
            </Form.Group>
            <div className="game-btn-container">
              <Button className="game-btn" type="submit" >
                {this.state.game_button}
              </Button>
              <Form.Group>
                <Form.Label className="disclaimer-text">Drinkyland is a safe-space for all beverages - alcoholic or not!  We are not responsible for underaged drinking. Please read our 
                  <span role="button" className="modal-link" onClick={() => this.showModal()}> disclaimer </span> before playing this game.
                </Form.Label>
              </Form.Group>
            </div>
          </Form>
        </div>

        <Disclaimer show={this.state.modalShow} onHide={() => this.hideModal()}/>
      </div>
    );
  }
}
