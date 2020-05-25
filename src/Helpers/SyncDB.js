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
  newPos: number,
  turnNumber: number,
}

export type syncState = {
  actions: Array<action>,
  players: Array<player>,
  curr_player: number,
  connected: boolean,
  started: boolean,
  lastMove: ?move,
}

const playerStepDelay = 250;

export default class SyncDB {
  static defaultState = {
    actions: [],
    players : [],
    curr_player: 0,
    connected: false,
    started: false,
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
      const newData = snapshot.val();
      const val = {
        ...newData,
        connected: !!newData, // If we get a null val, the game doesn't have a firebase entry
        lastMove: (newData ?? {}).lastMove ?? undefined // Updates lastMove if it's missing from Firebase
      };
      this.currentState = val;
      component.setState(val);
    }.bind(this));
  }

  // Update the gamestate from moving a player x spaces
  makeMove(roll: number, playerID: number) {
    var { players, actions, lastMove } = this.currentState;
    var prevPos = players[playerID].pos;
    const next = (playerID + 1) % players.length;
    const newPos = Math.min(prevPos + roll, actions.length-1)

    // Log the move so we can animate it
    const thisMove = {
      player: playerID,
      roll: roll,
      prevPos: prevPos,
      newPos: newPos,
      turnNumber: (lastMove?.turnNumber ?? 0) + 1,
    }

    // Make the move in Firebase
    this.rootRef.set({
      ...this.currentState,
      roll: roll,
      curr_player: next,
      lastMove: thisMove
    });

    // Animate the player to get there
    this.stepPlayerTo(playerID, newPos)
  }

  stepPlayerTo(playerID: number, targetPos: number){
    const curPos = this.currentState.players[playerID].pos;
    if (curPos < targetPos){
      this.rootRef.child('players/'+playerID).update({
        'pos': curPos+1
      });

      setTimeout(this.stepPlayerTo.bind(this, playerID, targetPos), playerStepDelay);
    };
  }

  // Set this game as started
  startGame() {
    this.rootRef.update({
      'started': true
    });
  }

  // Reset all players and the player order
  resetGame() {
    var players = this.currentState.players;
    for (var id = 0; id < players.length; id++) {
      players[id]['pos'] = 0;
    }

    this.rootRef.update({
      players: players,
      curr_player: 0,
      lastMove: null,
     });
  }
}
