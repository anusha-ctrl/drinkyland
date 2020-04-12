import React, { Component } from 'react';
import Tile from './Tile';
import './App.css';
//import {css, scss, js, bootstrap} from './lib'
import * from jquery
import * as css from './css/grayscale.css'
import * as js from './js/grayscale.js'
import firebase from './firebase.js'; // <--- add this line


class App extends Component {
  tiles = [];

  constructor() {
    super();

    this.tiles = [];
    for (let i = 0; i < 50; i++){
      this.tiles.push(<Tile/>);
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
      // <div className="App">
      //   <header className="App-header">
      //     <h1 className="App-logo">DrinkyLand</h1>
      //     <p>{this.state.players}</p>
      //   </header>
      // </div>
      <>
      <head>

        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <title>Grayscale - Start Bootstrap Theme </title>

        <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
        <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Varela+Round" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet" />

        <link href="css/grayscale.min.css" rel="stylesheet" />

      </head>

      <body id="page-top">

      <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
        <div class="container">
          <a class="navbar-brand js-scroll-trigger" href="#page-top">Start Bootstrap</a>
          <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            Menu
            <i class="fas fa-bars"></i>
          </button>
          <div class="collapse navbar-collapse" id="navbarResponsive">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <a class="nav-link js-scroll-trigger" href="#about">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link js-scroll-trigger" href="#projects">Projects</a>
              </li>
              <li class="nav-item">
                <a class="nav-link js-scroll-trigger" href="#signup">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <header class="masthead">
        <div class="container d-flex h-100 align-items-center">
          <div class="mx-auto text-center">
            <h1 class="mx-auto my-0 text-uppercase">Grayscale</h1>
            <h2 class="text-white-50 mx-auto mt-2 mb-5">A free, responsive, one page Bootstrap theme created by Start Bootstrap.</h2>
            <a href="#about" class="btn btn-primary js-scroll-trigger">Get Started</a>
          </div>
        </div>
      </header>


      <footer class="bg-black small text-center text-white-50">
        <div class="container">
          Copyright &copy; Your Website 2019
        </div>
      </footer>

      <script src="vendor/jquery/jquery.min.js"></script>
      <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

      <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

      <script src="js/grayscale.min.js"></script>

    </body>

    </>
    );
  }
}

export default App;
