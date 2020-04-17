import React, {Component} from "react";
import {Form, Button } from 'react-bootstrap';
import firebase from './firebase.js';
import App from './App';

export default class Signin extends Component{
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      roomID: ""
    };
  }

  generateRoomID() {
    return Math.floor(Math.random() * (10000));
  }

  handleSubmit(event) {
    var roomID = event.target.formRoomID.value;
    const currGame = firebase.database().ref("games");

    if (roomID === null || roomID === '' || roomID === undefined) {
      roomID = this.generateRoomID().toString();
      currGame.update({
        [roomID]: {players: {
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
      },
      });
    }

    this.setState({
      roomID : roomID
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
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="formRoomID">
            <Form.Label>Room ID</Form.Label>
            <Form.Control type="text" placeholder="Enter Game ID if you have one" />
          </Form.Group>
          <Button variant="primary" type="submit" >
            Play Game!
          </Button>
        </Form>
      </div>
    );
  }
}
