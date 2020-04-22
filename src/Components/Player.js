// @flow
import React, {Component} from "react";
import '../css/player.scss';
import Bartender from '../Helpers/Bartender.js';

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

type Props = {
  name: string,
  color: string,
  location: number,
  drink: string,
  active: boolean,
}

export default class Player extends Component<Props> {

  render() {
    let { active, drink } = this.props;

    return (
      <div className={"player" + (active ? ' floating' : '')}>
        <img src={Bartender.pour(drink)} alt={drink} className="invert"/>
      </div>
    );
  }
}
