import React, {Component} from "react";
import { Navbar } from 'react-bootstrap';


// This is gonna have the player's name, color, title of the game,
// Curre

export default class StatusBar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      name : this.props.name,
      color : this.props.color,
      roll : -1,
    };
  }

  render () {
    return (
      <div>
        <Navbar bg="light">
          <Navbar.Text>Your Name: { this.state.name }</Navbar.Text>
          <Navbar.Text>Your Color: { this.state.color }</Navbar.Text>
          <Navbar.Text>Roll: { this.state.roll } </Navbar.Text>
        </Navbar>
      </div>
    );
  }
}
