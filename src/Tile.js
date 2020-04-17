import React, { Component } from 'react';
import './tile.css';

export default class Tile extends Component {
  // constructor(props){
  //   super(props);
  //   // this.state = {
  //   //   players: []
  //   // };
  // }

  render(){
    return (
      <div className={"tile " + this.props.type} style={{width: 100/this.props.cols+'vw', height: 100/this.props.cols+'vw', background: this.props.color}}>
        <p>{this.props.action}</p>
        <div className="tile-players">
          {this.props.players}
        </div>
      </div>
    )
  }

  // addPlayer = (newPlayer) => {
  //   var curPlayers = this.state.players;
  //   var newPlayers = curPlayers.push(newPlayer);
  //   this.setState({
  //     players: newPlayers
  //   });
  // }
  //
  // removePlayer = (playerID) => {
  //   var newPlayerList = this.state.players.filter(player => player.getID() !== playerID);
  //   this.setState({
  //     players: newPlayerList
  //   });
  // }
}
