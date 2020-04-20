import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

// Pages
import Signin from './Signin';
import Game from './Game';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={Signin} />
      <Route path="/room/:roomID" component={Game} />
    </Switch>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
