// @flow
import { Component } from 'react';
import firebase from './firebase.js';

export type action = {
  title: string,
  description: string,
};

export type player = {
  color: string,
  drink: string,
  name: string,
  pos: number
}

export type move = {
  player: number,
  roll: number,
  prevPos: number,
  newPos: number
}

export type syncState = {
  actions: Array<action>,
  players: Array<player>,
  curr_player: number,
  connected: boolean,
  lastMove: ?move,
}

export default class SyncDB {
  static defaultState = {
    actions: [],
    players : [],
    curr_player: 0,
    connected: false,
    lastMove: null,
  }
  rootRef: any;
  currentState: syncState;

  constructor(address: string) {
    this.rootRef = firebase.database().ref(address);
    this.currentState = SyncDB.defaultState;
  }

  // Continuously keep a component's state in sync with
  // the Firebase db
  syncState(component: Component<any,any>) {
    this.rootRef.on('value', function(snapshot) {
      this.currentState = snapshot.val();
      component.setState(snapshot.val());
    }.bind(this))
  }

  // Update the gamestate from moving a player x spaces
  makeMove(roll: number, playerID: number){
    var { players, actions } = this.currentState;
    var prevPos = players[playerID].pos;
    const next = (playerID + 1) % players.length;
    const newPos = Math.min(prevPos + roll, actions.length-1)

    // Log the move so we can animate it
    const lastMove = {
      player: playerID,
      roll: roll,
      prevPos: prevPos,
      newPos: newPos,
    }

    // Move the player
    players[playerID].pos = newPos;

    // Make the move in Firebase
    this.rootRef.set({
      ...this.currentState,
      roll: roll,
      curr_player: next,
      players: players,
      lastMove: lastMove
    });
  }

  // Reset all players and the player order
  resetGame(){
    var players = this.currentState.players;
    for (var id = 0; id < players.length; id++) {
      players[id]['pos'] = 0;
    }

    this.rootRef.update({
      players: players,
      curr_player: 0,
      roll: -1,
      lastMove: null,
     });
  }
}
