// @flow
import React, {Component} from "react";

// Helpers
import Bartender from '../Helpers/Bartender.js';

// Types
import type {syncState} from '../Helpers/SyncDB.js';
import type SyncDB from '../Helpers/SyncDB.js';

// Styling
import '../css/playerlist.scss';

type Props = {
  syncState: syncState,
  syncDB: SyncDB
}

export default class PlayerList extends Component<Props>{
  startGame() {
    this.props.syncDB.startGame();
  }

  render() {
    let { players } = this.props.syncState;

    return (
      <div className="player-list">
        <h2>Welcome to</h2>
        <h1 className="logo">DrinkyLand</h1>
        <hr/>
        <h2>Players</h2>
        <div>
          {players.map((p, i) => {
            return (
            <div className="player-row">
              <p className="rank">{i+1}.</p>
              <img className="floating" src={Bartender.pour(p['drink'])} alt={p['drink']} height="20px" width="20px"/>
              <p>{p.name}</p>
            </div>)
          })}
        </div>
        <hr/>
        <p className="start-desc">Click to start the game.<br/>Players can still join after the game starts.</p>
        <div className="btn transition-all" onClick={this.startGame.bind(this)}>
          <div>Start Game</div>
        </div>
      </div>
    )
  }
}
