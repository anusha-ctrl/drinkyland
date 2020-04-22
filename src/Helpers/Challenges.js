//@flow
import seedrandom from 'seedrandom';
// Types
import type { syncState, action } from '../Helpers/SyncDB.js';

export default class Challenges {

  // Descriptions can use formatting identifiers
  // %c is the player who just moved.
  // %p is a random non-current player. Put multiple in a description for unique people.
  // %d is the value of the last roll.
  static starter_challenges = [
    [ 'Start', '' ],
    [ '< 5\'10"', 'If you\'re shorter than 5\'10", then drink.' ],
    [ 'Truth or Drink', '%p comes up with a question. Either answer it truthfully or drink.' ],
    [ 'Spelling Bee', '%p, %p, and %p come up with words. Spell them each correctly or drink.' ],
    [ 'Chug', 'Take that drink and bottom it out.' ],
    [ 'Drink Your Roll', 'Drink for %d seconds.' ],
    [ 'Guess a Song', '%p, %p, and %p each hum a song. Guess each one correctly in 15 seconds or drink.' ],
    [ 'Nobody Laugh', 'Next person to laugh drinks.' ],
    [ 'Everyone Drinks', 'Cheers!' ],
    [ 'Nose Goes', 'Last person to touch their nose drinks.' ],
    [ 'Guess a Num', '%p comes up with a number from 1-10. Guess it correctly or drink.' ],
    [ '2 Truths and a Lie', 'Message 2 truths and 1 lie in the chat. On 3, everyone guesses the lie. Losers drink.' ],
    [ 'Never Have I Ever', 'Everyone gets 3 lives. Play Never Have I Ever until the first person loses.' ],
    [ 'Mate', 'Pick someone who will drink whenever you drink.' ],
    [ 'Drink Your Roll Forever', 'Every time a %d gets rolled again, drink.' ],
    [ 'Everyone Drinks', 'Cheers!' ],
    [ 'Question Master', '%c is now Question Master! Whenever someone answers your question without a question, they drink.' ],
    [ 'Pick Somebody', 'Pick somebody to drink.' ],
    [ '10 Pushups', 'Drop and do 10.' ],
    [ 'Categories', 'Pick a category, Go in alphabetical order and say things from that category. The first person to take > 5 seconds or get it wrong drinks.' ],
    [ 'KMK', 'The group picks 3 people. Pick your options to Kiss, Marry, and Kill.' ],
    [ 'Rhymes', 'Pick a word. Go in alphabetical order and say words that rhyme. The first person to take > 5 seconds or get it wrong drinks.' ],
    [ 'Birthday', 'Guess everyone\'s birthday. Drink for each one you get wrong.' ],
    [ 'Sober Drinks', 'The most sober person drinks.' ],
    [ '21', 'Play 21 until you reach 21 twice or four people drink.' ],
    [ 'Musical Heads Up', 'Ask Pavi how this works' ],
    [ 'HotSeat', 'Everyone gets 120 seconds to ask you questions. Answer fast or drink.' ],
    [ 'Celebrity Impression', 'Imitate a celebrity. The first person to guess correctly wins, everyone else drinks.' ],
    [ 'Pictionary', 'Draw a picture. The first person to guess wins, everyone else drinks.' ],
    [ 'Ghost', 'Go in alphabetical order saying letters. You lose if you spell a word or make it impossible to spell a word and the next person calls bluff.' ],
    [ 'Heaven', 'Last person to point their finger up drinks.' ],
    [ 'Hey Cutie', 'Text the 8th person on your list the message \'Hey cutie\'' ],
    [ 'End', '' ]
  ]

  static getDefaults() {
    return Challenges.starter_challenges.map<action>((pair) => {
      return {title: pair[0], description: pair[1]}
    });
  }

  static format(raw: string, state: syncState, seed: string){
    // Replace all instances of the current player
    //$FlowFixMe TODO: Fix this shenanigan error ignoring
    raw = raw.replace(/%c/g, String(state.players[state.lastMove.player].name));

    // Replace all the rolls
    raw = raw.replace(/%d/g, String(state.lastMove?.roll))

    // Randomly assign players who didn't just roll to %p identifiers
    var newOrder = state.players.slice();
    if (state.lastMove !== null && newOrder.length > 1){
      //$FlowFixMe Flow doesn't recognize that lastMove must be nonnull here
      newOrder.splice(state.lastMove.player, 1);
    }
    Challenges.shuffle(newOrder, seed);
    var i = 0;
    while (raw.includes('%p')){
      raw = raw.replace('%p', String(newOrder[i%newOrder.length].name));
      i++;
    }
    return raw;
  }

  // Shuffles the array in-place using Fisher-Yates.
  // Is this overkill? Probably.
  static shuffle(array: Array<any>, seed: string){
    // Make a predictable pseudorandom number generator.
    // It's pseudorandom so all clients get the same order.
    let rand = new seedrandom(seed);

    for(let i = 0; i < array.length; i++){
      const j = Math.floor(rand() * i)
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
  }
}
