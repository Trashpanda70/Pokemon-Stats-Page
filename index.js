const PORT = 8080;
const express = require('express');
const app = express();

app.use(express.json());
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

//import the exported function and call it with app
require('./endpoints/moves')(app);
require('./endpoints/pokemon')(app);