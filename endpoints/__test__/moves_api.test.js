const request = require('supertest');

//construct test app
const express = require('express');
const app = express();
app.use(express.json());

//set up endpoints to use test app with test database
require('../moves')(app, 'test-files/test.db');

//tests
describe('testing moves API', () => {

  test("all moves", async () => {
    const res = await request(app).get('/moves');

    expect(res.statusCode).toBe(200);
    //4 moves
    expect(res.body.data.length).toBe(4);
    //check all attributes are there
    res.body.data.forEach(element => {
      expect(element.m_name).toBeDefined();
      expect(element.m_type).toBeDefined();
      expect(element.m_category).toBeDefined();
      expect(element.m_power).toBeDefined();
      expect(element.m_accuracy).toBeDefined();
      expect(element.m_pp).toBeDefined();
      expect(element.m_description).toBeDefined();
    });
    //check correct attributes for a move
    const m = res.body.data[3]; //earthquake
    expect(m.m_name).toBe('Earthquake');
    expect(m.m_type).toBe('ground');
    expect(m.m_power).toBe(100);
    expect(m.m_pp).toBe(10);
    expect(m.m_accuracy).toBe(100);
  });

  test("query for power = 90", async () => {
    const res = await request(app).get('/moves').query({ power: 90 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    //check all attributes are there
    const m = res.body.data[0];
    expect(m.m_name).toBeDefined();
    expect(m.m_type).toBeDefined();
    expect(m.m_category).toBeDefined();
    expect(m.m_power).toBeDefined();
    expect(m.m_accuracy).toBeDefined();
    expect(m.m_pp).toBeDefined();
    expect(m.m_description).toBeDefined();
    //check correct attributes
    expect(m.m_name).toBe('Attack Order');
    expect(m.m_type).toBe('bug');
    expect(m.m_power).toBe(90);
  });

  test("query for minpower 100", async () => {
    const res = await request(app).get('/moves').query({ minpower: 100 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(2);
    //check all attributes are there
    res.body.data.forEach(element => {
      expect(element.m_name).toBeDefined();
      expect(element.m_type).toBeDefined();
      expect(element.m_category).toBeDefined();
      expect(element.m_power).toBeDefined();
      expect(element.m_accuracy).toBeDefined();
      expect(element.m_pp).toBeDefined();
      expect(element.m_description).toBeDefined();
    });
    //check correct attributes
    let m = res.body.data[0];
    expect(m.m_name).toBe('Megahorn');
    expect(m.m_type).toBe('bug');
    expect(m.m_power).toBe(120);
    m = res.body.data[1]
    expect(m.m_name).toBe('Earthquake');
    expect(m.m_type).toBe('ground');
    expect(m.m_power).toBe(100);
  });

  test("query for bug type", async () => {
    const res = await request(app).get('/moves').query({ type: 'bug' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(2);
    //check all attributes are there
    res.body.data.forEach(element => {
      expect(element.m_name).toBeDefined();
      expect(element.m_type).toBeDefined();
      expect(element.m_category).toBeDefined();
      expect(element.m_power).toBeDefined();
      expect(element.m_accuracy).toBeDefined();
      expect(element.m_pp).toBeDefined();
      expect(element.m_description).toBeDefined();
    });
    //check correct attributes
    let m = res.body.data[0];
    expect(m.m_name).toBe('Megahorn');
    expect(m.m_type).toBe('bug');
    expect(m.m_power).toBe(120);
    m = res.body.data[1]
    expect(m.m_name).toBe('Attack Order');
    expect(m.m_type).toBe('bug');
    expect(m.m_power).toBe(90);
  });

  test('query for single move', async () => {
    //Megahorn
    const res = await request(app).get('/moves/Megahorn');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
    let m = res.body.data;
    expect(m.m_name).toBe('Megahorn');
    expect(m.m_category).toBe('Physical');
    expect(m.m_power).toBe(120);
    expect(m.m_accuracy).toBe(85);
    expect(m.m_pp).toBe(10);
    expect(m.m_description).toBeDefined();

    //Thunder Wave
    const res2 = await request(app).get('/moves/Thunder%20Wave');
    expect(res2.statusCode).toBe(200);
    expect(res2.body.data).toBeDefined();
    m = res2.body.data;
    expect(m.m_name).toBe('Thunder Wave');
    expect(m.m_category).toBe('Status');
    expect(m.m_power).toBe(0);
    expect(m.m_accuracy).toBe(90);
    expect(m.m_pp).toBe(20);
    expect(m.m_description).toBeDefined();
  });
});