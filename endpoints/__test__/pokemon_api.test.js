const request = require('supertest');
const db = require('../../database/db');

//construct test app
const express = require('express');
const InputData = require('../../io/readYAML');
const app = express();
app.use(express.json());

//set up endpoints to use test app with test database
require('../pokemon')(app, 'test-files/test.db');

//tests
describe('testing pokemon API', () => {

  beforeAll(async () => {
    cmd = "CREATE TABLE IF NOT EXISTS pokemon(p_name TEXT PRIMARY KEY,p_types TEXT NOT NULL,p_base_stats TEXT NOT NULL,";
    cmd += "p_evs TEXT NOT NULL,p_abilities TEXT NOT NULL,p_hidden_abilities TEXT DEFAULT 'none',p_move_levels TEXT,";
    cmd += "p_moves TEXT,p_tutor_moves TEXT,p_egg_moves TEXT,p_egg_groups TEXT DEFAULT 'Undiscovered')";
    await db.runCommand(cmd, `test-files/test.db`);
    await InputData.readPokemon(`test-files/test.db`, `test-files/pokemonTest.yml`);
    await new Promise(resolve => setTimeout(resolve, 1500)); //idk bro 
  });

  test("all pokemon", async () => {
    const res = await request(app).get('/pokemon');
    expect(res.statusCode).toBe(200);
    //9 pokemon
    expect(res.body.data.length).toBe(9);
    //check all attributes are there
    res.body.data.forEach(element => {
      expect(element.p_name).toBeDefined();
      expect(element.p_types).toBeDefined();
      expect(element.p_base_stats).toBeDefined();
      expect(element.p_abilities).toBeDefined();
      expect(element.p_moves).toBeDefined();
      expect(element.p_move_levels).toBeDefined();
    });
    const p = res.body.data[3]; //charmander
    expect(p.p_name).toBe('Charmander');
    expect(p.p_types).toBe('fire');
  });

  test("all pokemon with stat query >=500", async () => {
    const res = await request(app).get('/pokemon').query({ loweststats: 500 });

    expect(res.statusCode).toBe(200);
    //3 pokemon
    expect(res.body.data.length).toBe(3);
    //check all attributes are there
    res.body.data.forEach(element => {
      expect(element.p_name).toBeDefined();
      expect(element.p_types).toBeDefined();
      expect(element.p_base_stats).toBeDefined();
      expect(element.p_abilities).toBeDefined();
      expect(element.p_moves).toBeDefined();
      expect(element.p_move_levels).toBeDefined();
    });
    expect(res.body.data[0].p_name).toBe('Venusaur');
    expect(res.body.data[1].p_name).toBe('Charizard');
    expect(res.body.data[2].p_name).toBe('Blastoise');
  });

  test("all pokemon with stat query =534 (Charizard)", async () => {
    const res = await request(app).get('/pokemon').query({ stats: 534 });

    expect(res.statusCode).toBe(200);
    //1 pokemon
    expect(res.body.data.length).toBe(1);
    //check all attributes are there (ik theres only 1 pokemon but copy-paste)
    res.body.data.forEach(element => {
      expect(element.p_name).toBeDefined();
      expect(element.p_types).toBeDefined();
      expect(element.p_base_stats).toBeDefined();
      expect(element.p_abilities).toBeDefined();
      expect(element.p_moves).toBeDefined();
      expect(element.p_move_levels).toBeDefined();
    });
    expect(res.body.data[0].p_name).toBe('Charizard');
  });

  test("one pokemon - Squirtle", async () => {
    const res = await request(app).get('/pokemon/Squirtle');

    expect(res.statusCode).toBe(200);
    //check all attributes 
    const p = res.body.data;
    //check values
    expect(p.p_name).toBe('Squirtle');
    expect(p.p_types).toBe('water');
    expect(p.p_base_stats).toBe('44,48,65,43,50,64');
    expect(p.p_evs).toBe('0,0,1,0,0,0');
    expect(p.p_abilities).toBe('torrent');
    expect(p.p_hidden_abilities).toBe('raindish');
    expect(p.p_move_levels).toBe('1,4,7,10,13,16,19,22,25,28,31,34,37,40');
    expect(p.p_moves).toBeDefined();
    expect(p.p_moves.length).toBeGreaterThan(100);
    expect(p.p_tutor_moves).toBeDefined();
    expect(p.p_tutor_moves.length).toBeGreaterThan(300);
    expect(p.p_egg_moves).toBeDefined();
    expect(p.p_egg_groups).toBe('Monster,Water1')
  });

  test("all grass type Pokemon", async () => {
    const res = await request(app).get('/pokemon/type/grass');

    expect(res.statusCode).toBe(200);
    //3 pokemon
    expect(res.body.data.length).toBe(3);
    //check all attributes are there
    res.body.data.forEach(element => {
      expect(element.p_name).toBeDefined();
      expect(element.p_types).toBeDefined();
      expect(element.p_base_stats).toBeDefined();
      expect(element.p_abilities).toBeDefined();
      expect(element.p_moves).toBeDefined();
      expect(element.p_move_levels).toBeDefined();
    });
    expect(res.body.data[0].p_name).toBe('Bulbasaur');
    expect(res.body.data[1].p_name).toBe('Ivysaur');
    expect(res.body.data[2].p_name).toBe('Venusaur');
  });

  test("type matchups", async () => {
    //Squirtle (single type - water)
    let res = await request(app).get('/pokemon/Squirtle/defenses');
    expect(res.statusCode).toBe(200);
    let types = res.body.data;
    //effectivenesses
    expect(types.normal).toBe(1);
    expect(types.fire).toBe(0.5);
    expect(types.water).toBe(0.5);
    expect(types.electric).toBe(2);
    expect(types.grass).toBe(2);
    expect(types.ice).toBe(0.5);
    expect(types.fighting).toBe(1);
    expect(types.poison).toBe(1);
    expect(types.ground).toBe(1);
    expect(types.flying).toBe(1);
    expect(types.psychic).toBe(1);
    expect(types.bug).toBe(1);
    expect(types.rock).toBe(1);
    expect(types.ghost).toBe(1);
    expect(types.dragon).toBe(1);
    expect(types.dark).toBe(1);
    expect(types.steel).toBe(0.5);
    expect(types.fairy).toBe(1);

    //Charizard (two types - Fire and Flying)
    let res2 = await request(app).get('/pokemon/Charizard/defenses');
    expect(res.statusCode).toBe(200);
    types = res2.body.data;
    //effectivenesses
    expect(types.normal).toBe(1);
    expect(types.fire).toBe(0.5);
    expect(types.water).toBe(2);
    expect(types.electric).toBe(2);
    expect(types.grass).toBe(0.25);
    expect(types.ice).toBe(1);
    expect(types.fighting).toBe(0.5);
    expect(types.poison).toBe(1);
    expect(types.ground).toBe(0);
    expect(types.flying).toBe(1);
    expect(types.psychic).toBe(1);
    expect(types.bug).toBe(0.25);
    expect(types.rock).toBe(4);
    expect(types.ghost).toBe(1);
    expect(types.dragon).toBe(1);
    expect(types.dark).toBe(1);
    expect(types.steel).toBe(0.5);
    expect(types.fairy).toBe(0.5);

  });
});