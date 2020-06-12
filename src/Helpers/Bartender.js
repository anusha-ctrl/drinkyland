// @flow
import React from 'react';
import '../css/bartender.scss';
import * as Bar from './Bar';
import type { drink } from './SyncDB';

export default class Bartender {
  static pourImg(drink: drink, options: any) {
    // Fetch the raw image paths for each element
    const glassImgPath = Bar.glasses[drink.glass];
    const liquidImgPath = Bar.liquids[drink.glass];
    const toppingImgPath = Bar.toppings[drink.topping];

    console.log("Drink: ", drink);
    console.log("Topping: ", drink.topping);
    console.log("toppingPath: ", toppingImgPath);
    console.log("toppings: ", Bar.toppings);

    // TODO (devdo): Compute a style to color the liquid to match the rgb passed in

    // TODO (devdo): Overlay all these images on top of each other
    options.className = 'drink-container ' + options.className;
    return <div {...options}>
      <img src={glassImgPath}/>
      <img src={liquidImgPath}/>
      <img src={toppingImgPath}/>
    </div>
  }
}
