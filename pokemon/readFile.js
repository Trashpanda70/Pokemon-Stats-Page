const Pokemon = require('./pokemon');
const fs = require('fs');
const readline = require('readline');

const filepath = '../files/pokemon.txt';

/**
 * Builds an array of Pokemon objects
 */
async function readPokemonFile() {
  const fileStream = fs.createReadStream(filepath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

}