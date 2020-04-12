import React, { Component, Fragment } from 'react';
import Tile from './Tile';
import StatusBar from './StatusBar';
import './App.css';
import firebase from './firebase.js';
<<<<<<< HEAD
import { Button, Row, Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

=======
import { Button, Row, Navbar, Nav, Jumbotron } from 'react-bootstrap';
>>>>>>> 506eb32c6fcc7e9a978d052d7fd142795e64c0cf


class App extends Component {
  tiles = [];

  constructor() {
    super();

    this.tiles = [];
    // Row 1
    for (let i = 0; i < 10; i++){
      this.tiles.push(<Tile action='drink' type='action'/>);
    }
    // Row 2
    for (let i = 0; i < 9; i++){
      this.tiles.push(<Tile type='empty'/>);
    }
    this.tiles.push(<Tile action='drink' type='action'/>);
    // Row 3
    for (let i = 0; i < 10; i++){
      this.tiles.push(<Tile action='drink' type='action'/>);
    }
    // Row 4
    this.tiles.push(<Tile action='drink' type='action'/>);
    for (let i = 0; i < 9; i++){
      this.tiles.push(<Tile type='empty'/>);
    }
    // Row 5
    for (let i = 0; i < 10; i++){
      this.tiles.push(<Tile action='drink' type='action'/>);
    }

    this.state = {
      playerVal: "trying to connect to firebase.."
    }
  }

  componentDidMount() {
    const playersRef = firebase.database().ref('players');
    playersRef.on('value', (snapshot) => {
      let playerVal = snapshot.val();
      this.setState({
        players: playerVal
      });
    })
  }

  render() {
    return (
      <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav>
      </Navbar>

      <Jumbotron>
        <h1>Player Status</h1>
        <p>
          Name:
        </p>
        <p>
          Color:
        </p>
      </Jumbotron>

      <div className="App">
        // <header className="App-header">
        //   <h1 className="App-logo">DrinkyLand</h1>
        //   <p>{this.state.players}</p>
        // </header>
        <StatusBar location="yo mama's house" name="Bob" color="purple" />
        <div class="board">
          {this.tiles}
        </div>
      </div>
    </div>
      // </>
    );
  }
}

export default App;
