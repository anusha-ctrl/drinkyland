import React, { Component } from 'react';
import './tile.scss';

export default class Tile extends Component {
  contains_just_moved(players){
    for (const i in players){
      if (players[i].props.just_moved){
        return players[i].props;
      }
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      showing_description: true,
    }
  }

  render(){
    let missingAction = this.props.type == 'action' && !this.props.action;
    let just_picked_player = this.contains_just_moved(this.props.players ?? []);

    return (
      <div className={"tile " + this.props.type + ' ' + (just_picked_player && 'active')} style={{width: 100/this.props.cols+'vw', height: 100/this.props.cols+'vw', background: missingAction ? 'transparent' : this.props.color}}>
        {just_picked_player && this.state.showing_description &&
          <div className="description-card" style={{background: this.props.color}}>
            <h1>{just_picked_player.name}</h1>
            <h1>{this.props.action}</h1>
            <p>{this.props.description}</p>
            <button onClick={() => this.setState({showing_description: false})}>Done</button>
          </div>
        }
        <p>{this.props.action}</p>
        <div className="tile-players">
          {this.props.players}
        </div>
      </div>
    )
  }
}
