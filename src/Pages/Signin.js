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
  validCreateRoom: bool,
  validJoinRoom: bool,
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
        validCreateRoom: true,
        validJoinRoom: true,
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


  handleKeyUpCreate() {
    this.setState({
      validCreateRoom: true,
    });
  }

  handleKeyUpJoin() {
    this.setState({
      validJoinRoom: true,
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
      } else {
        this.setState({
          validCreateRoom: false
        });
      }
    });

    event.preventDefault();
  }

  handleJoinSubmit(event: any) {
    var roomID = event.target.formRoomIDJoin.value;

    const gameRef = firebase.database().ref("games/"+roomID);
    gameRef.once('value', (snapshot) => {
      if (!snapshot.exists()){
        this.setState({
          validJoinRoom: false
        });
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
          <Form onSubmit={this.handleCreateSubmit.bind(this)} onKeyUp={this.handleKeyUpCreate.bind(this)}>            
            <div>
              <Button className="signin-btn" type="button" onClick={this.handleCreateClick.bind(this)}>
                CREATE <FontAwesomeIcon icon={(this.state.showCreateForm ? faCaretUp : faCaretDown)} />
              </Button>
              <div style={{ display: (this.state.showCreateForm ? "block" : "none")}}>
                <Form.Group controlId="formRoomIDCreate">
                  <Form.Control 
                    className="form-input" 
                    type="text"
                    placeholder="Enter Game ID to create" 
                    isInvalid={!this.state.validCreateRoom}
                  />
                  <Form.Control.Feedback type="invalid">
                    This room ID has already been taken.
                  </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" className="submit-btn" >
                  Submit!
                </Button>
              </div>
            </div>
          </Form>

          <Form onSubmit={this.handleJoinSubmit.bind(this)} onKeyUp={this.handleKeyUpJoin.bind(this)}>
            <div>
              <Button className="signin-btn" type="button" onClick={this.handleJoinClick.bind(this)}>
                JOIN <FontAwesomeIcon icon={(this.state.showJoinForm ? faCaretUp : faCaretDown)} />
              </Button>
              <div style={{ display: (this.state.showJoinForm ? "block" : "none")}}>
                <Form.Group controlId="formRoomIDJoin">
                  <Form.Control 
                    className="form-input" 
                    type="text" 
                    placeholder="Enter Game ID to join" 
                    isInvalid={!this.state.validJoinRoom}
                  />
                  <Form.Control.Feedback type="invalid">
                    This room ID does not exist.
                  </Form.Control.Feedback>
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
