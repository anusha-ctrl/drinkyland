// @flow
import React, { Component } from 'react';
import { Form, Button, Container, Navbar, Nav } from 'react-bootstrap';
import { MDBContainer } from "mdbreact";
import firebase from '../Helpers/firebase.js';
import type { action } from '../Helpers/SyncDB.js';

// Helpers
import Challenges from '../Helpers/Challenges.js';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Signin.scss';
import '../css/Custom.scss';

type State = { actions : Array<action> }

type Props = {roomID : string,
              playerIndex : number,
              cookies : any,
              history : any};

const initial_state = {
  players: {},
  curr_player: 0,
  started: false,
}

const init_actions = Challenges.getDefaults();


class Custom extends Component<Props, State> {
  constructor(props : Props) {
      super(props);
      this.state = {
        actions: [],
      }
  }

  getDbActions() {
    const gameRef = firebase.database().ref("games/"+this.props.roomID)
                            .child("actions");
    gameRef.once('value', (snapshot) => {
      var actions = snapshot.val();
      this.setState({
        actions: actions,
      })
    });
  }

  componentDidMount() {
    this.getDbActions();
  }

  handleOnChange(i : number, e : any, message : string) {
    e.preventDefault();
    const actions = this.state.actions;
    actions[i] = {title: message, description: ''};
    this.setState({
      actions: actions
    });
  }

  createForm(){
    const actions = this.state.actions;
    const fi_elems = actions.map((item, i) => React.createElement(
      Form.Control,
      {
        key : i, 
        value : item.title, 
        type : "text", 
        onChange : (event) => this.handleOnChange(i, event, event.target.value)},
    ));
    const fg_elems = actions.map((item, i) => React.createElement(
      Form.Group,
      {
        key : i,
        controlId : "FormGroup" + i.toString(),
        className : "customTilesFG",
      },
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
    e.preventDefault();
    const gameRef = firebase.database().ref("games/"+this.props.roomID);
    gameRef.once('value', (snapshot) => {
      if (!snapshot.exists()){
        gameRef.set({
          ...initial_state,
          actions: this.state.actions,
          players: {
            '0': {pos: 0, color: 'nah', name: "Bob", drink: "beer"}
          }
        });
      } else {
        gameRef.child('actions').set(this.state.actions);
      }
    });

    // Redirects to the game!
    this.props.cookies.set(this.props.roomID, this.props.playerIndex, { path: '/'});
    this.props.history.push('/room/'+this.props.roomID);
  }

  render() {
    if (this.state.actions.length) {
      return (
        <div>
          <Navbar className = "outer-navbar" bg="dark" variant="dark" >
            <a href="/" className="logo">DrinkyLand</a>
            <Nav className="mr-auto">
              <Navbar.Text className="ml-10">Game Room ID: {this.props.roomID}</Navbar.Text>
            </Nav>
          </Navbar>
          <Container className="text-center">
            {this.createForm()}
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <Button variant="primary" type="submit" className="customButton">
                Confirm!
              </Button>
            </Form>
          </Container>
        </div>
      );
    } else {
      return <div className = "connecting-overlay"><h1>Connecting...</h1></div>;
    }
  }
}

export default Custom;
