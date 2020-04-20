import beer from '../img/beer.svg';
import champagne from '../img/champagne.svg';
import margarita from '../img/margarita.svg';
import lemonade from '../img/lemonade.svg';
import martini from '../img/martini.svg';
import tequila from '../img/tequila.svg';
import whiskey from '../img/whiskey.svg';
import wine from '../img/wine.svg';

const drinkMap = {
  beer: beer,
  champagne: champagne,
  margarita: margarita,
  lemonade: lemonade,
  martini: martini,
  tequila: tequila,
  whiskey: whiskey,
  wine: wine,
};

export default class Bartender {
  static pour(drink) {
    return drinkMap[drink];
  }
}
