import React, { Component } from 'react';
import './tile.css';

class Tile extends Component {
  render(){
    return (
      <div class={"tile " + this.props.type}>
        <p>{this.props.action}</p>
      </div>
    )
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default Tile;
