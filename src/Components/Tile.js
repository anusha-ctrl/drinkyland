// @flow
// JS
import React, { Component } from 'react';
// Styling
import '../css/tile.scss';
// Types
import type { Element } from 'react';
import Player from './Player.js';

type Props = {
  type: string,
  cols: number,
  players?: Array<Element<typeof Player>>,
  color?: string,
  action?: string,
}

export default class Tile extends Component<Props> {
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
