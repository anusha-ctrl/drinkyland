import React, {Component} from "react";

// Player pieces are images
// Player needs an ID. Default is 0. Set ID later.


//TODO: Get list of available colors
//TODO: Global counter for player IDs
//TODO: Player constructor:
  // square ID
  // personal ID
  // name
//FLOW:
  // User "logs in". Enters their name. Code (The Game) instantiates a Player.
  // The Game (calling Firebase) will assign the player one of the remaining
  // colors. <Player name=name color=color loc=loc/>
  // Moves: On players turn, users will call The Game's function to roll dice.
  // The Game will re-render the Player by updating its location.
//TODO: props = {name (given by user), color (given by game)}
//TODO: state = {game location, name, color}

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
        location : this.props.location,
        name : this.props.name,
        color : this.props.color,
      };
  }

  render() {
    return (
      <img src="public/red_piece.png" height="70px" width="100px"/>
    );
  }
}

function getLocation() {
  return this.state.location;
}

function getName() {
  return this.state.name;
}

function getColor() {
  return this.state.color;
}
