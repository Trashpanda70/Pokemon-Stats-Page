const express = require('express');
const app = express();
const conn = require('./db');
const PORT = 8080;

//make express use json so it can parse correctly
app.use(express.json());


//start app
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

//Endpoints
app.get('/todos', async (req, res) => {
  //error checking (set resolution status early if needed)
  //...
  //connect to database for operation and return result depending on success / failure
  await conn('select * from todolist').then(
    (resolve) => {
      console.log("Query Resolved!");
      res.status(200).json({
        status: "success",
        length: resolve?.length,
        data: resolve
      });
    }, (reject) => {
      //maybe figure out how to get error code / message
      console.log("Query Rejected!");
      res.status(500).json({
        status: "failure",
        message: "Operation did not succeed"
      });
    }
  );
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
