const PORT = 2222;
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/frontend')); // eslint-disable-line no-undef
app.use(express.json());
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

//import the exported function and call it with app
require('./endpoints/webpage')(app);
require('./endpoints/moves')(app);
require('./endpoints/pokemon')(app);