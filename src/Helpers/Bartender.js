// @flow
import React from 'react';
import '../css/bartender.scss';
import * as Bar from './Bar';
import type { drink } from './SyncDB';

export default class Bartender {
  static pourImg(drink: drink, options: any) {
    // Fetch the raw image paths for each element
    const { glass, topping } = drink;
    const glassImgPath = Bar.glasses[glass];
    const liquidImgPath = Bar.liquids[glass];
    const toppingImgPath = Bar.toppings[topping];

    // TODO (devdo): Compute a style to color the liquid to match the rgb passed in

    // Overlay all these images on top of each other
    options.className = 'drink-container ' + options.className;
    return <div {...options}>
      <img src={glassImgPath}/>
      <img src={liquidImgPath}/>
      <img src={toppingImgPath}/>
    </div>
  }
}
