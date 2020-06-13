// @flow
import React from 'react';
import '../css/bartender.scss';
import * as Bar from './Bar';
import type { drink } from './SyncDB';

export default class Bartender {
  static pourImg(drinkObj: drink, options: any) {
    options = options ?? {}
    // Fetch the raw image paths for each element
    const { glass, topping } = drinkObj;
    const glassImgPath = Bar.glasses[glass];
    const liquidImgPath = Bar.liquids[glass];
    const toppingImgPath = Bar.toppings[topping];

    // TODO (devdo): Compute a style to color the liquid to match the rgb passed in

    // Overlay all these images on top of each other
    options.className = 'drink-container ' + options.className;
    return <div {...options}>
      <img src={glassImgPath} alt={glass}/>
      <img src={liquidImgPath} alt={glass}/>
      <img src={toppingImgPath} alt={topping}/>
    </div>
  }
}
