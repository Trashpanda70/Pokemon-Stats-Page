const { getTypeWeaknesses } = require('poke-types');
const { noEffect, notVeryEffective, superEffective, ultraEffective } = require('poke-types/effectiveness');

class Pokemon {
  /*
    stat order: HP, attack, defense, speed, sp attack, sp defense.
    Goes for base stats and evs.
  */
  constructor(name, types, stats, evs, abilities, hidden_abilities, move_levels, moves, tutor_moves, egg_moves, egg_groups) {
    this.name = name; //string
    this.types = types; //array of strings
    this.stats = stats; //array of ints
    this.ev_points = evs; //array of ints
    this.abilities = abilities; //array of strings
    this.hidden_abilities = hidden_abilities; //array of strings
    this.move_levels = move_levels; //array of ints
    this.moves = moves; //array of strings
    this.tutor_moves = tutor_moves; //array of objects
    this.egg_moves = egg_moves; //array of objects
    this.egg_groups = egg_groups; //array of strings
  }

  canLearnMove(move, includeEggMoves = false) {
    let nonEgg = this.moves.includes(move) || this.tutor_moves.includes(move);
    if (includeEggMoves) {
      return nonEgg || this.egg_moves.includes(move);
    }
    return nonEgg;
  }

  getTypeDefenses() {
    if (this.types[1])
      return getTypeWeaknesses(this.types[0]);
    return getTypeWeaknesses(this.types[0], this.types[1]);
  }
}

module.exports = Pokemon;