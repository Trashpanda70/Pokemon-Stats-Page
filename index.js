const PORT = 8080;
const express = require('express');
const path = require('path');
const app = express();
// read data in
// const { readMoves, readPokemon } = require('./io/readYAML');
// (async () => {
//   await readMoves();
//   await readPokemon();
// })();

app.use(express.static(__dirname + '/html')); // eslint-disable-line no-undef
app.use(express.json());
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

//import the exported function and call it with app
require('./endpoints/webpage')(app);
require('./endpoints/moves')(app);
require('./endpoints/pokemon')(app);