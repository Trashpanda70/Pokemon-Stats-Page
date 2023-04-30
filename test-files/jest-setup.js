const fs = require('fs');
const db = require('../database/db');
const readData = require('../io/readYAML');

module.exports = async (globalConfig, projectConfig) => {
  globalThis.__FILE__ = `test-files/test.db`;

  //setup moves database
  let cmd = 'CREATE TABLE IF NOT EXISTS moves(m_name TEXT PRIMARY KEY,m_type TEXT NOT NULL,m_category TEXT NOT NULL,';
  cmd += 'm_power INTEGER DEFAULT 0,m_accuracy INTEGER DEFAULT 100,m_pp INTEGER NOT NULL,m_description TEXT NOT NULL);';
  await db.runCommand(cmd, globalThis.__FILE__);

  //setup pokemon database
  cmd = "CREATE TABLE IF NOT EXISTS pokemon(p_name TEXT PRIMARY KEY,p_types TEXT NOT NULL,p_base_stats TEXT NOT NULL,";
  cmd += "p_evs TEXT NOT NULL,p_abilities TEXT NOT NULL,p_hidden_abilities TEXT DEFAULT 'none',p_move_levels TEXT,";
  cmd += "p_moves TEXT,p_tutor_moves TEXT,p_egg_moves TEXT,p_egg_groups TEXT DEFAULT 'Undiscovered')";
  await db.runCommand(cmd, globalThis.__FILE__);

  //read data into databases
  await readData.readMoves(globalThis.__FILE__, `test-files/movesTest.yml`);
  await readData.readPokemon(globalThis.__FILE__, `test-files/pokemonTest.yml`);
};