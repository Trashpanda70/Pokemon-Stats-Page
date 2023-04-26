//this class was tested manually and proven to work with the actual files to be used
const yaml = require('yaml');
const fs = require('fs');
const db = require('../database/db');
const yamlPath = './output-files';
const dbPath = '../database/db-files/test.db';

/**
 * Reads the moves.yml file and stores the results in the database
 * Database is reset each time since its pretty quick and simple (as opposed to checking if it needs update, just do the 2 calls)
 */
exports.readMoves = async () => {
  const buildYamlContent = await fs.promises.readFile(`${yamlPath}/moves.yml`, 'utf8');
  const file = yaml.parse(buildYamlContent);
  let moves = [];
  for (let move of file.Moves) {
    moves.push([]); //add empty array as element
    //then fill data of array just pushed, creating a 2D array
    move.m_name = move.m_name.replaceAll("'", "''");
    moves[moves.length - 1][0] = `'${move.m_name}'`;
    moves[moves.length - 1][1] = `'${move.m_type}'`;
    moves[moves.length - 1][2] = `'${move.m_category}'`;
    moves[moves.length - 1][3] = move.m_power;
    moves[moves.length - 1][4] = move.m_accuracy;
    moves[moves.length - 1][5] = move.m_pp;
    move.m_description = move.m_description.replaceAll("'", "''");
    moves[moves.length - 1][6] = `'${move.m_description}'`;
  }
  //scuffed? yeah. Guaranteed to work? also yeah
  await db.deleteData('moves', true, dbPath).catch(err => {
    console.log(err);
  });
  await db.insertDataManyRows('moves', db.moveColumns, moves, false, dbPath).catch(err => {
    console.log(err);
  });
};

/**
 * Reads the pokemon.yml file and stores the results in the database
 * Database is reset each time since its pretty quick and simple (as opposed to checking if it needs update, just do the 2 calls)
 */
exports.readPokemon = async () => {
  const buildYamlContent = await fs.promises.readFile(`${yamlPath}/pokemon.yml`, 'utf8');
  const file = yaml.parse(buildYamlContent);
  let pokemon = [];
  for (let poke of file.Pokemon) {
    pokemon.push([]); //add empty array as element
    //ensure no apostraphes appear in data where they might appear
    poke.p_name = poke.p_name.replaceAll("'", "''");
    poke.p_abilities = poke.p_abilities.replaceAll("'", "''");
    poke.p_moves = poke.p_moves.replaceAll("'", "''");
    //some pokemon have no hidden abilities
    if (poke.p_hidden_abilities)
      poke.p_hidden_abilities = poke.p_hidden_abilities.replaceAll("'", "''");
    //some pokemon have no tutor moves or egg moves
    if (poke.p_tutor_moves)
      poke.p_tutor_moves = poke.p_tutor_moves.replaceAll("'", "''");
    if (poke.p_egg_moves)
      poke.p_egg_moves = poke.p_egg_moves.replaceAll("'", "''");
    //then fill data of array just pushed, creating a 2D array
    pokemon[pokemon.length - 1][0] = `'${poke.p_name}'`;
    pokemon[pokemon.length - 1][1] = `'${poke.p_types}'`;
    pokemon[pokemon.length - 1][2] = `'${poke.p_base_stats}'`;
    pokemon[pokemon.length - 1][3] = `'${poke.p_evs}'`;
    pokemon[pokemon.length - 1][4] = `'${poke.p_abilities}'`;
    pokemon[pokemon.length - 1][5] = `'${poke.p_hidden_abilities}'`;
    pokemon[pokemon.length - 1][6] = `'${poke.p_move_levels}'`;
    pokemon[pokemon.length - 1][7] = `'${poke.p_moves}'`;
    pokemon[pokemon.length - 1][8] = `'${poke.p_tutor_moves}'`;
    pokemon[pokemon.length - 1][9] = `'${poke.p_egg_moves}'`;
    pokemon[pokemon.length - 1][10] = `'${poke.p_egg_groups}'`;
  }
  //scuffed? yeah. Guaranteed to work? also yeah
  await db.deleteData('pokemon', true, dbPath).catch(err => {
    console.log(err);
  });
  await db.insertDataManyRows('pokemon', db.pokeColumns, pokemon, false, dbPath).catch(err => {
    console.log(err);
  });
};
