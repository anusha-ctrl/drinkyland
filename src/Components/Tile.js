import React, { Component } from 'react';
import '../css/tile.scss';

export default class Tile extends Component {
  render(){
    let missingAction = this.props.type === 'action' && !this.props.action;

    return (
      <div className={"tile " + this.props.type} style={{width: 100/this.props.cols+'vw', height: 100/this.props.cols+'vw', background: missingAction ? 'transparent' : this.props.color}}>
        <p>{this.props.action}</p>
        <div className="tile-players">
          {this.props.players}
        </div>
      </div>
    )
  }
}
