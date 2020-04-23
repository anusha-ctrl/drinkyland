//@flow
import React, {Component} from "react";
import {Form, Button } from 'react-bootstrap';
import firebase from '../Helpers/firebase.js';
import Challenges from '../Helpers/Challenges.js';

// Styling
import '../css/Signin.scss';

const initial_state = {
  actions: Challenges.getDefaults(),
  players: {},
  curr_player: 0,
  started: false,
 }

export default class Signin extends Component<any>{
  generateRoomID() {
    return Math.floor(Math.random() * (10000));
  }

  handleSubmit(event: any) {
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
      // Now the game should exist and the player should be added. Gogogo.
      this.props.history.push('room/'+roomID);
    });

    event.preventDefault();
  }

  render() {
    return (
      <div className="signin-parent">
        <div className="signin-container">
          <h1 className="logo">DrinkyLand</h1>

          <Form onSubmit={this.handleSubmit.bind(this)}>
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

            <Button variant="primary" type="submit" >
              Play Game!
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}
