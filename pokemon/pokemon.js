const { getTypeWeaknesses } = require('poke-types');
const { noEffect, notVeryEffective, superEffective, ultraEffective } = require('poke-types/effectiveness');

class Pokemon {
  /*
    stat order: HP, attack, defense, speed, sp attack, sp defense.
    Goes for base stats and evs.
  */
  constructor(name, types, stats, evs, abilities, hidden_abilities, moves, tutor_moves, egg_moves, egg_groups, evolutions) {
    this.name = name; //string
    this.types = []; //array of strings
    this.stats = stats; //array of ints
    this.ev_points = evs; //array of ints
    this.abilities = []; //array of strings
    this.hidden_abilities = []; //array of strings
    this.moves = moves; //object - constructed in readfile
    this.tutor_moves = []; //array of strings
    this.egg_moves = []; //array of strings
    this.egg_groups = egg_groups; //array of strings
    this.evolutions = evolutions; //object - constructed in readfile
    //change simple arrays to lowercase 
    types.forEach((x) => this.types.push(x.toLowerCase()));
    abilities.forEach((x) => this.abilities.push(x.toLowerCase()));
    hidden_abilities.forEach((x) => this.hidden_abilities.push(x.toLowerCase()));
    tutor_moves.forEach((x) => this.tutor_moves.push(x.toLowerCase()));
    egg_moves.forEach((x) => this.egg_moves.push(x.toLowerCase()));
  }

  canLearnMove(move, includeEggMoves = false) {
    let nonEgg = this.moves.includes(move) || this.tutor_moves.includes(move);
    if (includeEggMoves) {
      return nonEgg || this.egg_moves.includes(move);
    }
    return nonEgg;
  }

  doesEvolve() {
    return this.evolutions ? true : false;
  }

  getTypeDefenses() {
    if (this.types[1])
      return getTypeWeaknesses(this.types[0]);
    return getTypeWeaknesses(this.types[0], this.types[1]);
  }
}

module.exports = Pokemon;
//MOVES OBJECT CONSTRUCTION
// let moves = ['dsagfga', 'tytttt', 'hhhhh'];
// let moveNums = [1, 1, 3];
// let x = {};
// for (let i = 0; i < moves.length; i++) {
//   if (x[moveNums[i]]) {
//     x[moveNums[i]].push(moves[i]);
//   } else {
//     x[moveNums[i]] = [moves[i]];
//   }
// }
// console.log(x);