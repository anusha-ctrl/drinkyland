import React, {Component} from "react";
import { Navbar } from 'react-bootstrap';


// This is gonna have the player's name, color, title of the game,
// Curre

export default class StatusBar extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>
        <Navbar bg="light">
          <Navbar.Text>Roll: { this.props.roll } </Navbar.Text>
          <Navbar.Text>Current Player: { this.props.curr_player } </Navbar.Text>
        </Navbar>
      </div>
    );
  }
}
