const express = require('express');
const app = express();
const db = require('./database/db');
const PORT = 8080;

//make express use json so it can parse correctly
app.use(express.json());
let database = db.connect();

//start app
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

//req is request (incoming data)
//res is response (outgoing data)
//Endpoints
app.get('/todos', async (req, res) => {
  let cmd = 'select * from todolist';
  let data = await db.execAllCommand(database, cmd);
  console.log(data);
  res.status(200).send({ msg: `data retrieved: ${data}` });
});
db.close(database);

app.post('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  if (!data) {
    res.status(400).send({ message: "Did not specify data" });
  }
  //would save
  res.status(200).send({
    data: `your data of ${data} was saved to id ${id}`
  });
});
