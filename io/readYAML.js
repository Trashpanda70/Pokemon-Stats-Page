//this class was tested manually and proven to work with the actual files to be used
const yaml = require('yaml');
const fs = require('fs');
const db = require('../database/db');
const yamlPath = './io/output-files';
const dbPathMoves = './database/db-files/moves.db';
const dbPathPokemon = './database/db-files/pokemon.db';
const dbPathAbilities = './database/db-files/abilities.db';

/**
 * Reads the moves.yml file and stores the results in the database
 * Database is reset each time since its pretty quick and simple (as opposed to checking if it needs update, just do the 2 calls)
 */
exports.readMoves = async (dbPath = dbPathMoves, readPath = `${yamlPath}/moves.yml`) => {
  const buildYamlContent = await fs.promises.readFile(readPath, 'utf8');
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
  await db.deleteData('moves', dbPath).catch(err => {
    console.log(err);
  });
  await db.insertDataManyRows('moves', db.moveColumns, moves, dbPath).catch(err => {
    console.log(err);
  });
};

/**
 * Reads the pokemon.yml file and stores the results in the database
 * Database is reset each time since its pretty quick and simple (as opposed to checking if it needs update, just do the 2 calls)
 */
exports.readPokemon = async (dbPath = dbPathPokemon, readPath = `${yamlPath}/pokemon.yml`) => {
  const buildYamlContent = await fs.promises.readFile(readPath, 'utf8');
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
    //some pokemon have no evolutions
    if (poke.p_evolutions)
      poke.p_evolutions = poke.p_evolutions.replaceAll("'", "''");
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
    pokemon[pokemon.length - 1][11] = `'${poke.p_evolutions}'`;
  }
  //scuffed? yeah. Guaranteed to work? also yeah
  await db.deleteData('pokemon', dbPath).catch(err => {
    console.log(err);
  });
  await db.insertDataManyRows('pokemon', db.pokeColumns, pokemon, dbPath).catch(err => {
    console.log(err);
  });
};

exports.readAbilities = async (dbPath = dbPathAbilities, readPath = `${yamlPath}/abilities.yml`) => {
  const buildYamlContent = await fs.promises.readFile(readPath, 'utf8');
  const file = yaml.parse(buildYamlContent);
  let abilities = [];
  for (let ab of file) {
    ab.a_name = ab.a_name.replaceAll("'", "''");
    ab.a_description = ab.a_description.replaceAll("'", "''");
    abilities.push([`'${ab.a_name}'`, `'${ab.a_description}'`]);
  }
  await db.deleteData('abilities', dbPath).catch(err => {
    console.log(err);
  });
  await db.insertDataManyRows('abilities', db.abilityColumns, abilities, dbPath).catch(err => {
    console.log(err);
  });
};

exports.readPokemonNames = (readPath = `${yamlPath}/pokemon.yml`) => {
  const buildYamlContent = fs.readFileSync(readPath, 'utf8');
  const file = yaml.parse(buildYamlContent);
  return file.Names;
};
