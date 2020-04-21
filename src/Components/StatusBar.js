//@flow

import React, {Component} from "react";
import { Navbar } from 'react-bootstrap';


// This is gonna have the player's name, color, title of the game,
// Curre

type Props = {
  name: string,
  color: string,
  roll: number,
}

export default class StatusBar extends Component<Props> {
  render () {
    return (
      <div>
        <Navbar bg="light">
          <Navbar.Text>Your Name: { this.props.name }</Navbar.Text>
          <Navbar.Text>Your Color: { this.props.color }</Navbar.Text>
          <Navbar.Text>Roll: { this.props.roll } </Navbar.Text>
        </Navbar>
      </div>
    );
  }
}
