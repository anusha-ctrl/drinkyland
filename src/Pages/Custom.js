// @flow
import React, { Component } from 'react';
import { Form, Button, Container, Navbar, Nav } from 'react-bootstrap';
import { MDBContainer } from "mdbreact";
import firebase from '../Helpers/firebase.js';

// Helpers
import Challenges from '../Helpers/Challenges.js'

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Signin.scss';
import '../css/Custom.scss';


const initial_state = {
  actions: Challenges.getDefaults(),
  players: {},
  curr_player: 0,
  started: false,
}

class Custom extends Component<any> {
  createForm(){
    const actions = initial_state.actions;
    const fi_elems = actions.map((item, i) => React.createElement(
      Form.Control,
      {key : i, value : item.title, type : "text"}
    ));
    const fg_elems = actions.map((item, i) => React.createElement(
      Form.Group,
      {key : i, controlId : "FormGroup" + i.toString(), className : "customTilesFG"},
      fi_elems[i]
    ));
    return (
      <MDBContainer>
        <div className="customTiles scrollbar scrollbar-primary  mt-5 mx-auto">
          {fg_elems}
        </div>
      </MDBContainer>

    );
  }


  handleSubmit(e : any) {
    const gameRef = firebase.database().ref("games/"+this.props.roomID);
    gameRef.once('value', (snapshot) => {
      if (!snapshot.exists()){
        console.log("State 1");
        gameRef.set({
          ...initial_state,
          players: {
            '0': {pos: 0, color: 'nah', name: "Bob", drink: "beer"}
          }
        });
      } else {
        console.log("state 2");
        gameRef.child('actions').update(initial_state.actions);
      }
    });

    // Redirects to the game!
      this.props.cookies.set(this.props.roomID, this.props.playerIndex, { path: '/'});
      this.props.history.push('/room/'+this.props.roomID);
  }

  render() {
    const res = this.createForm();
    return (
      <div>
        <Navbar className = "outer-navbar" bg="dark" variant="dark" >
          <a href="/" className="logo">DrinkyLand</a>
          <Nav className="mr-auto">
            <Navbar.Text className="ml-10">Game Room ID: {this.props.roomID}</Navbar.Text>
          </Nav>
        </Navbar>
        <Container className="text-center">
          {res}
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <Button variant="primary" type="submit" className="customButton">
              Confirm!
            </Button>
          </Form>
        </Container>
      </div>
    );
  }

}

export default Custom;
