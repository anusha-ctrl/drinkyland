import React, {Component} from "react";
import {Form, Button } from 'react-bootstrap';
import firebase from './firebase.js';
import App from './App';
import './Signin.scss';

const default_actions = ['Start', '<5\'10"', 'Truth or Drink', 'Spelling Bee', 'CHUG', 'Drink ur Roll', 'Guess a Song', 'Don\'t Laugh', 'Everyone Drink', 'Nose Goes', 'Guess a Num', '2 Truths and a Lie', 'Never Have I Ever', 'Mate', 'Drink ur Roll Forever', 'Everyone Drink', 'Question Master','Pick Somebody','10 Pushups', 'Categories', 'Rhymes', 'Birthday', 'Sober Drinks', '21', 'Musical Heads Up', 'HotSeat', 'Celebrity Impression', 'Pictionary', 'Ghost', 'Heaven', 'Hey Cutie', 'End'];
const default_descriptions = ['just start yo', 'If you\'re shorter than 5\'10", then drink', 'Someone comes up with a question. Either answer it truthfully or drink.', 'Three people give words. You must spell it correctly or drink.', 'Finish that drink yo.', 'Drink the number of seconds as your roll.', 'One-by-one, everyone hums a song. Guess the song correctly in 20 seconds or drink.', 'Next person to laugh drinks.', 'Cheers!', 'Last person to touch their nose drinks.', 'Someone comes up with a number from 1-10. Guess it correctly or drink.', 'Message 2 truths and 1 lie in the chat. On 3, everyone guesses the lie. Losers drink.', 'Everyone gets 3 lives. Player never have I ever until the first person loses.', 'Pick someone who will drink whenever you drink.', 'Every time your roll gets rolled again, drink.', 'Everybody drink!', 'Until someone else is question master, if you ask someone a question and they answer without a question - they drink.','Pick somebody to drink','Drop and do 10.', 'Pick a category, Go in alphabetical order and say things from that category. The first person to take >5 seconds or get it wrong drinks.', 'Pick a word, Go in alphabetical order and say words that rhyme. The first person to take > 5 seconds or get it wrong drinks.', 'Guess everyone\'s birthday. Drink for each one you get wrong.', 'The most sober person drinks. Everyone votes.', 'Play 21 until you reach 21 twice or four people drink.', 'Ask Pavi how this works', 'Everyone gets 120 seconds to ask you questions. Answer fast or drink.', 'Imitate a celebrity. The first person to guess correctly wins, everyone else drinks.', 'Draw a picture. The first person to guess wins, everyone else drinks.', 'Go in alphabetical order saying letters. You lose if you, with the previous letters, spell a word or make it impossible to spell a word and the next person calls bluff.', 'Last person to point their finger up drinks.', 'Text the 8th person on your list (FB or Text Messages) the message \'Hey cutie\'', 'You made it! Now FMK.'];

const default_action_descriptions = default_actions.map(function(action, i) {
  return {title: action, description: default_descriptions[i]}
});

const initial_state = {
  actions: default_action_descriptions,
  players: {
     0: {pos: 0, color: 'red', name: 'Nami', drink: 'margarita'},
     1: {pos: 0, color: 'orange', name: 'Chillara', drink: 'wine'},
     2: {pos: 0, color: 'crimson', name: 'Pavi', drink: 'martini'},
     3: {pos: 0, color: 'blueviolet', name: 'Maya', drink: 'beer'},
     4: {pos: 0, color: 'blue', name: 'Mahima', drink: 'champagne'},
     5: {pos: 0, color: 'purple', name: 'Devdo', drink: 'whiskey'},
     6: {pos: 0, color: 'teal', name: 'Arka', drink: 'lemonade'}
   },
   curr_player: 0,
   roll: -1,
 }

export default class Signin extends Component{
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      roomID: ""
    };
  }

  generateRoomID() {
    return Math.floor(Math.random() * (10000));
  }

  handleSubmit(event) {
    var roomID = event.target.formRoomID.value;
    var name = event.target.name.value;
    var drink = event.target.drink.value;

    // Generate a room id for them if they didn't provide one
    if (roomID === null || roomID === '' || roomID === undefined) {
      roomID = this.generateRoomID().toString();
    }

    // If this room doesn't exist yet, initialize it
    const gameRef = firebase.database().ref("games/"+roomID);
    gameRef.once('value', (snapshot) => {
      if (!snapshot.exists()){
        // duplicated from App.js, fix pls
        initial_state['players'] = {
          0: {pos: 0, color: 'nah', name: name, drink: drink}
        };
        gameRef.set(initial_state);
      } else {
        var playerLen = snapshot.val()['players'].length;
        let playerObj = {}
        playerObj[playerLen] = {pos: 0, color: 'nah', name: name, drink: drink}
        gameRef.child('players').update(playerObj);
      }
      this.setState({
        roomID : roomID
      });
    });

    event.preventDefault();
  }

  render() {
    if (this.state.roomID !== ""){
      const addr = "games/"+this.state.roomID+"/";
      return (
        <App roomID={this.state.roomID} addr={addr}/>
      );
    }

    return (
      <div className="signin-parent">
        <div className="signin-container">
          <h1 className="logo">DrinkyLand</h1>

          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="formRoomID">
              <Form.Label>Room ID</Form.Label>
              <Form.Control type="text" placeholder="Enter Game ID to create or join" />
            </Form.Group>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control required type="text" placeholder="Enter your name"/>
            </Form.Group>
            <Form.Group controlId="drink">
              <Form.Label>Pick your drink of choice (and make it unique!)</Form.Label>
              <Form.Control required as="select">
                <option>beer</option>
                <option>champagne</option>
                <option>lemonade</option>
                <option>margarita</option>
                <option>martini</option>
                <option>tequila</option>
                <option>whiskey</option>
                <option>wine</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit" >
              Play Game!
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}
