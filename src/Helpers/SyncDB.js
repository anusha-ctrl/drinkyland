// @flow
import React, { Component } from 'react';
import firebase from './firebase.js';

export type remoteState = {
  actions: Array<string>,
  players: Array<any>,
  curr_player: number,
  roll: number
}

export default class SyncDB {
  static defaultState = {
    actions: [],
    players : [],
    curr_player: 0,
    roll: -1
  }
  rootRef: any;
  currentState: remoteState;

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

  // Broadcast the result of a roll from this client
  setRoll(roll: number, next: number, players: Array<any>){
    this.currentState = {
      ...this.currentState,
      roll: roll,
      curr_player: next,
      players: players,
    }

    this.rootRef.set(this.currentState);
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
     });
  }
}
