const request = require('supertest');
const db = require('../../database/db');

//construct test app
const express = require('express');
const InputData = require('../../io/readYAML');
const app = express();
app.use(express.json());

//require endpoints for abilities
require('../abilities')(app, 'test-files/test.db');

//tests
describe('testing abilities api', () => {
  beforeAll(async () => {
    cmd = 'CREATE TABLE IF NOT EXISTS abilities (a_name TEXT PRIMARY KEY, a_description TEXT NOT NULL);';
    await db.runCommand(cmd, `test-files/test.db`);
    await InputData.readAbilities(`test-files/test.db`, `test-files/abilitiesTest.yml`);
    await new Promise(resolve => setTimeout(resolve, 1000)); //idk bro
  });

  test("All abilities", async () => {
    const res = await request(app).get('/abilities');
    expect(res.statusCode).toBe(200);
    //9 abilities
    expect(res.body.data.length).toBe(9);
    //check the names and descriptions
    res.body.data.forEach(element => {
      expect(element.a_name).toBeDefined();
      expect(element.a_description).toBeDefined();
    });
    const a1 = res.body.data[0];
    const a3 = res.body.data[2];
    expect(a1.a_name).toBe('Stench')
  });
});