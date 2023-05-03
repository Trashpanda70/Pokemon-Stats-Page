const path = require('path');
const express = require('express');

const dir = '../html';
module.exports = function (app) {
  //main page
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, dir, '/index.html')); // eslint-disable-line no-undef
  });
};