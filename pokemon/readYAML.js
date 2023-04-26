const yaml = require('yaml');
const readfile = require('readfile');
const fs = require('fs');
const Move = require('./move');
const Pokemon = require('./pokemon');
const db = require('../database/db');

const path = '../JavaIO/output-files';

/**
 * Reads the moves.yml file and stores the results in the database
 * Depending on update variable the operation will either be PUT (update = true) or POST (update = false) 
 */
async function readMoves(update = true) {
  const buildYamlContent = await fs.promises.readFile(`${path}/moves.yml`, 'utf8');
  const file = yaml.parse(buildYamlContent);
  let moves = [];
  for (let move of file.Moves) {
    moves.push([]); //add empty array as element
    //then fill data of array just pushed, creating a 2D array
    move.name = move.name.replaceAll("'", "''");
    moves[moves.length - 1][0] = `'${move.name}'`;
    moves[moves.length - 1][1] = `'${move.type}'`;
    moves[moves.length - 1][2] = `'${move.category}'`;
    moves[moves.length - 1][3] = move.power;
    moves[moves.length - 1][4] = move.accuracy;
    moves[moves.length - 1][5] = move.pp;
    move.description = move.description.replaceAll("'", "''");
    moves[moves.length - 1][6] = `'${move.description}'`;
  }
  await db.insertDataManyRows('moves', db.moveColumns, moves, false, './database/db-files/test.db').catch(err => {
    console.log(err);
  });
}

async function readPokemon(updateMoves) {
  let moves = {};
}



