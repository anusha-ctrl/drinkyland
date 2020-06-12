// @flow
import React, {Component} from "react";
import * as Bar from '../Helpers/Bar';
import '../css/DrinkCustomizer.scss';
import type { drink } from '../Helpers/SyncDB';

import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';


type Props = {}
type State = {
  glassPos: number,
  liquidPos: number,
  toppingPos: number
}

export default class DrinkCustomizer extends Component<Props, State> {
  constructor() {
    super()
    this.state = { glassPos: 0, liquidPos: 0, toppingPos: 0 };
  }

  onChange(type: string, value: number) {
    if (type === 'glass'){
      this.setState({ glassPos: value, liquidPos: value });
    } else if (type === 'topping') {
      this.setState({ toppingPos: value });
    }
    console.log(value);
  }

  render() {
    // Fetch all the asset names in our bar
    const glasses = Object.keys(Bar.glasses);
    const toppings = Object.keys(Bar.toppings);

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
