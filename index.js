const express = require('express');
const app = express();
const pool = require('./db');
const PORT = 8080;

//make express use json so it can parse correctly
app.use(express.json());


//start app
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

//Endpoints
app.get('/todos', (req, res) => {
  pool.query("SELECT * FROM todos.todolist", (err, res) => {
    return console.log(res);
  });
  // res.status(200).json({
  //   status: "success",
  //   length: data?.length,
  //   data: data
  // });
});

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
