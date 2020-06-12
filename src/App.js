//@flow
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { withCookies } from 'react-cookie';

// Helpers
import SyncDB from './Helpers/SyncDB';

// Pages
import Signin from './Pages/Signin';
import Game from './Pages/Game';
import Join from './Pages/Join';


class App extends Component<any> {

  render() {
    return (
      <Switch>
        <Route exact path="/" render={(props) =>
          <Signin {...props} cookies = {this.props.cookies}/> }/>
        <Route path="/room/:roomID/join" render={(props) =>
          <Join
            roomID = {props.match.params.roomID}
            type = {this.props.cookies.get(props.match.params.roomID)}
            syncDB = {new SyncDB('games/'+props.match.params.roomID)}
          />} />
        <Route path="/room/:roomID" render={(props) =>
          <Game
            roomID = {props.match.params.roomID}
            playerID = {parseInt(this.props.cookies.get(props.match.params.roomID))}
            syncDB = {new SyncDB('games/'+props.match.params.roomID)}
          />} />
      </Switch>
    )
  }

}

export default withCookies(App);
