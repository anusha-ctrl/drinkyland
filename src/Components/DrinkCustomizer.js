// @flow
import React, {Component} from "react";
import * as Bar from '../Helpers/Bar';
import '../css/drinkcustomizer.scss';
import type { drink } from '../Helpers/SyncDB';

import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';


type Props = {
  onDrinkChange?: (drink) => void
}
type State = {
  glassPos: number,
  liquidPos: number,
  toppingPos: number
}

export default class DrinkCustomizer extends Component<Props, State> {
  glasses: Array<string>;
  toppings: Array<string>;

  constructor() {
    super()
    this.glasses = Object.keys(Bar.glasses);
    this.toppings = Object.keys(Bar.toppings);

    const glassPos = Math.round(Math.random()*this.glasses.length);
    const toppingPos = Math.round(Math.random()*this.toppings.length);
    this.state = { glassPos: glassPos, liquidPos: glassPos, toppingPos: toppingPos };
  }

  onChange(type: string, value: number) {
    // Update the positions in our state
    var state = this.state;
    if (type === 'glass'){
      state.glassPos = value;
      state.liquidPos = value;
    } else if (type === 'topping') {
      state.toppingPos = value;
    }
    this.setState(state);

    // If there's a callback, give it our new drink
    if(this.props.onDrinkChange){
      const { glasses, toppings } = this;
      const { glassPos, toppingPos } = state;
      const drink = {
        glass: glasses[glassPos % glasses.length],
        liquid: '',
        topping: toppings[toppingPos % toppings.length]
      }
      this.props.onDrinkChange(drink);
    }
  }

  render() {
    const { glasses, toppings } = this;

    // Render them all on top of each other
    // Each type gets its own carousel
    return (
      <div className='drink-customizer'>
        <Carousel
          infinite
          value = {this.state.liquidPos}
        >
          {glasses.map(glass => <img src={Bar.liquids[glass]} alt={glass} key={'liquid-opt-'+glass}/>)}
        </Carousel>

        <Carousel
          arrows
          infinite
          value = {this.state.glassPos}
          onChange={this.onChange.bind(this, 'glass')}
          className='glass-carousel'
        >
          {glasses.map(glass => <img src={Bar.glasses[glass]} alt={glass} key={'glass-opt-'+glass}/>)}
        </Carousel>

        <Carousel
          arrows
          infinite
          value = {this.state.toppingPos}
          onChange={this.onChange.bind(this, 'topping')}
          className = 'topping-carousel'
        >
          {toppings.map(topping => {
            return <img src={Bar.toppings[topping]} alt={topping} key={'topping-opt-'+topping}/>})}
        </Carousel>
      </div>
    );
  }
}
