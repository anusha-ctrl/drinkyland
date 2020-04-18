import React, {Component} from "react";
import {Form, Button } from 'react-bootstrap';
import firebase from './firebase.js';
import App from './App';
import './Signin.scss';

const default_actions = ['Start', '<5\'10"', 'Truth or Drink', 'Spelling Bee', 'CHUG', 'Drink ur Roll', 'Guess a Song', 'Everyone Drink', 'Nose Goes', 'Guess a Num', '2 Truths and a Lie', 'Never Have I Ever', 'Mate', 'Drink ur Roll Forever', 'Everyone Drinks', 'Question Master','Pick Somebody','10 Pushups', 'Categories', 'Rhymes', 'Birthday', 'Sober Drinks', '21', 'Musical Heads Up', 'HotSeat', 'Don\'t Laugh', 'Celebrity Impression', 'Pictionary', 'Ghost', 'Heaven', 'Hey Cutie', 'End'];
const initial_state = {
  actions: default_actions,
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
 }

export default class Signin extends Component{
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      roomID: "",
      badUserName: false,
    };
  }

  generateRoomID() {
    return Math.floor(Math.random() * (10000));
  }

  playerExists(name, players) {
    for (var i = 0; i < players.length; i++) {
      if (name === players[i]['name']) {
        return true;
      }
    }
    return false;
  }

  invalidNameMessage() {
    const message = 'This game already has a user with this name. Please enter a new name.';
    return this.state.badUserName ? message : '';
  }

  handleSubmit(event) {
    var roomID = event.target.formRoomID.value;
    var name = event.target.name.value;
    var drink = event.target.drink.value;

    // Generate a room id for them if they didn't provide one
    if (roomID === null || roomID === '' || roomID === undefined) {
      roomID = this.generateRoomID().toString();
    }

    // If this room doesn't exist yet, initialize it
    const gameRef = firebase.database().ref("games/"+roomID);
    gameRef.once('value', (snapshot) => {
      if (!snapshot.exists()){
        // duplicated from App.js, fix pls
        initial_state['players'] = {
          0: {pos: 0, color: 'nah', name: name, drink: drink}
        };
        gameRef.set(initial_state);
      } else {
        var players = snapshot.val()['players'];
        if (this.playerExists(name, players)) {
          this.setState({
            badUserName: true
          });
          return;
        }
        var playerLen = players.length;
        let playerObj = {}
        playerObj[playerLen] = {pos: 0, color: 'nah', name: name, drink: drink}
        gameRef.child('players').update(playerObj);
      }
      this.setState({
        roomID : roomID,
        badUserName: false,
      });
    });

    event.preventDefault();
  }

  render() {
    if (this.state.roomID !== ""){
      const addr = "games/"+this.state.roomID+"/";
      return (
        <App roomID={this.state.roomID} addr={addr}/>
      );
    }

    return (
      <div className="signin-parent">
        <div className="signin-container">
          <h1 className="logo">DrinkyLand</h1>

          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="formRoomID">
              <Form.Label>Room ID</Form.Label>
              <Form.Control type="text" placeholder="Enter Game ID to create or join" />
            </Form.Group>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control required type="text" placeholder="Enter your name"/>
              <Form.Text className="text-danger">{this.invalidNameMessage()}</Form.Text>
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

            <Button variant="primary" type="submit" >
              Play Game!
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}
