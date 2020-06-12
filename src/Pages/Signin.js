//@flow
import React, {Component} from "react";
import {Form, Button } from 'react-bootstrap';
import firebase from '../Helpers/firebase.js';
import Challenges from '../Helpers/Challenges.js';
import Disclaimer from '../Helpers/Disclaimer.js';


// Styling
import '../css/Signin.scss';

type State = { game_button : string, modalShow : boolean }

const initial_state = {
  actions: Challenges.getDefaults(),
  players: {},
  curr_player: 0,
  started: false,
 }

 const CREATE = "Create Game!";
 const JOIN = "Join Game!";


 export default class Signin extends Component<any, State>{
  constructor(props : any) {
      super(props);
      this.state = {
        game_button : CREATE,
        modalShow: false,
        actions: initial_state.actions.slice(1,-1).map(function (tile) { return tile.title; }).join(", "),
      };
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


  updateTiles(tiles_str) {
    var old_tiles = initial_state.actions;
    const new_tiles = tiles_str.split(", ");
    const old_len = old_tiles.length;
    const end = old_tiles[old_len-1];

    for (var i = 0; i < new_tiles.length; i++) {
      if (i <= old_len && old_tiles[i].title !== new_tiles[i]) {
        old_tiles[i] = {title: new_tiles[i], description: ''};
      } else {
        old_tiles.push({title: new_tiles[i], description: ''});
      }
    }

    if (old_len < old_tiles.length) {
      old_tiles.push(end);
    }

    initial_state.actions = old_tiles;
  }


  // Handles onChange function for Custom Tiles input
  handleOnChange(event : any) {
    event.preventDefault();
    var new_tiles = event.target.value;
    this.setState({
      actions: new_tiles,
    });
  }

  // Handles checking if game room is new or not
  handleKeyUp(event : any) {
    var roomID = event.currentTarget.formRoomID.value;
    if (roomID === null || roomID === '' || roomID === undefined) {
      return;
    }

    const gameRef = firebase.database().ref("games/"+roomID);
    gameRef.once('value', (snapshot) => {
      var button_text = JOIN;
      if (!snapshot.exists()){
        button_text = CREATE;
      }
      this.setState({
        game_button: button_text,
      });
    });
  }

  // Submits form
  handleSubmit(event: any) {
    var roomID = event.target.formRoomID.value;
    var name = event.target.name.value;
    var drink = event.target.drink.value;
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

          <Form onSubmit={this.handleSubmit.bind(this)} onKeyUp={this.handleKeyUp.bind(this)}>
            <Form.Group controlId="formRoomID">
              <Form.Label>Room ID</Form.Label>
              <Form.Control type="text" placeholder="Enter Game ID to create or join" />
            </Form.Group>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control required type="text" placeholder="Enter your name"/>
            </Form.Group>
            <Form.Group controlId="drink">
              <Form.Label>Pick your drink of choice (and make it unique!)</Form.Label>
              <Form.Control required as="select">
                <option>beer</option>
                <option>champagne</option>
                <option>lemonade</option>
                <option>margarita</option>
                <option>martini</option>
                <option>tequila</option>
                <option>whiskey</option>
                <option>wine</option>
              </Form.Control>
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
            <Form.Group controlId="tiles">
                <Form.Label>Customize tile messages by switching ours with your own! Separate with commas.</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows="3" 
                  placeholder="Custom Tile Messages" 
                  onChange={this.handleOnChange.bind(this)}
                  value={ this.state.actions }
                />
            </Form.Group>
          </Form>
        </div>

        <Disclaimer show={this.state.modalShow} onHide={() => this.hideModal()}/>
      </div>
    );
  }
}
