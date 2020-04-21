// @flow
// JS
import React, { Component } from 'react';
// Styling
import '../css/tile.scss';
// Types
import type { Element } from 'react';
import type { move } from '../Helpers/SyncDB';
import Player from './Player.js';

type Props = {
  type: string,
  cols: number,
  players?: Array<Element<typeof Player>>,
  color?: string,
  action?: string,
  actionIndex?: number,
  lastMove?: ?move,
}

export default class Tile extends Component<Props> {
  render(){
    let { type, action, lastMove, actionIndex } = this.props;
    let missingAction = (type === 'action' && !action);
    let isActive = (type === 'action' && lastMove?.newPos === actionIndex);

    return (
      <div
        className={'tile ' + this.props.type + (isActive ? ' active' : '')}
        style={{
          width: 100/this.props.cols+'vw',
          height: 100/this.props.cols+'vw',
          background: missingAction ? 'transparent' : this.props.color
        }}>
        <p>{this.props.action}</p>
        <div className="tile-players">
          {this.props.players}
        </div>
      </div>
    )
  }
}
