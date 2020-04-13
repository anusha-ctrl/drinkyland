import React, { Component } from 'react';
import './tile.css';

class Tile extends Component {
  constructor(props){
    super(props);
    // this.state = {
    //   players: []
    // };
  }

  render(){
    return (
      <div class={"tile " + this.props.type} style={{width: 100/this.props.cols+'vw', height: 100/this.props.cols+'vw'}}>
        <p>{this.props.action}</p>
        <div class="tile-players">
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

export default Tile;
