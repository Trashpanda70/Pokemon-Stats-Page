const PORT = 8080;
const express = require('express');
const app = express();
app.use(express.json()); //make express use json so it can parse correctly
app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); //start app
require('./endpoints/moves/moves')(app); //import the exported function and call it with app

app.post('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  if (!data) {
    res.status(400).send({ message: "Did not specify data" });
  }

  res.status(200).send({
    data: `your data of ${data} was saved to id ${id}`
  });
});
