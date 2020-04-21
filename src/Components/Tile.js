// @flow
import React, { Component } from 'react';
import Player from './Player.js';
import Challenges from '../Helpers/Challenges.js'
// Styling
import '../css/tile.scss';
// Types
import type { Element } from 'react';
import type { move, action, syncState } from '../Helpers/SyncDB';

type Props = {
  type: string,
  cols: number,
  players?: Array<Element<typeof Player>>,
  color?: string,
  action?: action,
  actionIndex?: number,
  syncState?: syncState,
}

export default class Tile extends Component<Props> {
  render(){
    let { type, action, syncState, actionIndex } = this.props;
    let lastMove = syncState?.lastMove;
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
        <p>{this.props.action?.title}</p>
        {/* <p>{this.props.action?.description && Challenges.format(this.props.action?.description, syncState)}</p> */}
        <div className="tile-players">
          {this.props.players}
        </div>
      </div>
    )
  }
}
