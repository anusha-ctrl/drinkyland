//@flow
import React, {Component} from "react";
import {Form, Button } from 'react-bootstrap';
import firebase from '../Helpers/firebase.js';
import Challenges from '../Helpers/Challenges.js';
import Disclaimer from '../Helpers/Disclaimer.js';
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


// Styling
import '../css/Signin.scss';

type State = { 
  game_button : string, 
  modalShow : boolean, 
  actions : string, 
  active: bool, 
  showCreateForm: bool,
  showJoinForm: bool, 
}

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
        active: false,
        showCreateForm: false,
        showJoinForm: false,
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

  handleCreateClick(event : any) {
    event.preventDefault();
    const showCreateForm = this.state.showCreateForm;
    this.setState({
      showCreateForm : !showCreateForm
    });
  }

  handleJoinClick(event : any) {
    event.preventDefault();
    const showJoinForm = this.state.showJoinForm;
    this.setState({
      showJoinForm : !showJoinForm
    });
  }

  render() {
    return (
      <div className="signin-parent">
        <div className="signin-container">
          <h1 className="logo">DrinkyLand</h1>

          <Form onSubmit={this.handleSubmit.bind(this)} onKeyUp={this.handleKeyUp.bind(this)}>
            
            <div>
              <Button className="signin-btn" type="button" onClick={this.handleCreateClick.bind(this)}>
                CREATE <FontAwesomeIcon icon={(this.state.showCreateForm ? faCaretUp : faCaretDown)} />
              </Button>
              <div style={{ display: (this.state.showCreateForm ? "block" : "none")}}>
                <Form.Group controlId="formRoomIDCreate">
                  <Form.Control type="text" placeholder="Enter Game ID to create" />
                </Form.Group>
                <Button type="button" className="submit-btn">
                  Submit!
                </Button>
              </div>
            </div>

            <div>
              <Button className="signin-btn" type="button" onClick={this.handleJoinClick.bind(this)}>
                JOIN <FontAwesomeIcon icon={(this.state.showJoinForm ? faCaretUp : faCaretDown)} />
              </Button>
              <div style={{ display: (this.state.showJoinForm ? "block" : "none")}}>
                <Form.Group controlId="formRoomIDJoin">
                  <Form.Control type="text" placeholder="Enter Game ID to join" />
                </Form.Group>
                <Button type="button" className="submit-btn">
                  Submit!
                </Button>
              </div>
            </div>

            <Button className="help-btn" type="button">
              HOW TO PLAY
            </Button>
            <div>
              <Form.Label className="disclaimer-text">Drinkyland is a safe-space for all beverages - alcoholic or not!  We are not responsible for underaged drinking. Please read our 
                    <span role="button" className="modal-link" onClick={() => this.showModal()}> disclaimer </span> before playing this game.
              </Form.Label>
            </div>

          </Form>
        </div>

        <Disclaimer show={this.state.modalShow} onHide={() => this.hideModal()}/>
      </div>
    );
  }
}
