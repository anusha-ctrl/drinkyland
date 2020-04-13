import React, {Component} from "react";
import {Form, FormControl, Button } from 'react-bootstrap';
import firebase from './firebase.js';

export default class Signin extends Component{
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.RoomID = ''
    this.NumPlayer = ''
  }

  handleSubmit(event) {
    const gameInfo = firebase.database().ref('gameInfo');
    console.log(event.target.formRoomID.value);
    gameInfo.push({
       roomID: event.target.formRoomID.value,
       numPlayer: event.target.formNumPlayer.value
     });
    event.preventDefault();
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group controlId="formRoomID">
          <Form.Label>Room ID</Form.Label>
          <Form.Control type="text" placeholder="Enter room id" />
        </Form.Group>

        <Form.Group controlId="formNumPlayer">
          <Form.Label>Number of Players</Form.Label>
          <Form.Control type="text" placeholder="Enter number of players" />
        </Form.Group>

        <Button variant="primary" type="submit" >
          Submit
        </Button>
      </Form>
    );
  }
}
