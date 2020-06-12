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

  handleCreateSubmit(event: any) {
    var roomID = event.target.formRoomIDCreate.value;

    if (roomID === null || roomID === '' || roomID === undefined) {
      roomID = this.generateRoomID().toString();
    }

    const gameRef = firebase.database().ref("games/"+roomID);
    gameRef.once('value', (snapshot) => {
      if (!snapshot.exists()){
        gameRef.set({
          ...initial_state,
        });

        this.props.cookies.set(roomID, "create", { path: '/'});
        this.props.history.push('/room/'+ roomID + '/join');
        // TODO: Redirect
      } else {
        // TODO: Let user know that room ID already exists
      }
    });

    event.preventDefault();
  }

  // TODO: Make joining games safe
  handleJoinSubmit(event: any) {
    var roomID = event.target.formRoomIDJoin.value;

    const gameRef = firebase.database().ref("games/"+roomID);
    gameRef.once('value', (snapshot) => {
      if (!snapshot.exists()){
        // TODO: Let user know that game room ID does not exist       
      } else {
        this.props.cookies.set(roomID, "join", { path: '/'});
        this.props.history.push('/room/'+ roomID + '/join');
      }
    });

    event.preventDefault();
  }

  render() {
    return (
      <div className="signin-parent">
        <div className="signin-container">
          <h1 className="logo">DrinkyLand</h1>

          <Form onSubmit={this.handleCreateSubmit.bind(this)}>
            
            <div>
              <Button className="signin-btn" type="button" onClick={this.handleCreateClick.bind(this)}>
                CREATE <FontAwesomeIcon icon={(this.state.showCreateForm ? faCaretUp : faCaretDown)} />
              </Button>
              <div style={{ display: (this.state.showCreateForm ? "block" : "none")}}>
                <Form.Group controlId="formRoomIDCreate">
                  <Form.Control type="text" placeholder="Enter Game ID to create" />
                </Form.Group>
                <Button type="submit" className="submit-btn" >
                  Submit!
                </Button>
              </div> 
            </div>
          </Form>

          <Form onSubmit={this.handleJoinSubmit.bind(this)}>
            <div>
              <Button className="signin-btn" type="button" onClick={this.handleJoinClick.bind(this)}>
                JOIN <FontAwesomeIcon icon={(this.state.showJoinForm ? faCaretUp : faCaretDown)} />
              </Button>
              <div style={{ display: (this.state.showJoinForm ? "block" : "none")}}>
                <Form.Group controlId="formRoomIDJoin">
                  <Form.Control type="text" placeholder="Enter Game ID to join" />
                </Form.Group>
                <Button type="submit" className="submit-btn">
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
