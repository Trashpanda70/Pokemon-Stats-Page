const db = require('../database/db');

//Specify path for testing, default will be the database file
module.exports = function (app, path = "./database/db-files/abilities.db") {
  /** get all abilities */
  app.get('/abilities', async (req, res) => {
    let cmd = 'select * from abilities;';
    await db.execAllCommand(cmd, path).then(data => {
      res.status(200).send({ data });
    }).catch(err => {
      res.status(err.status).send({ msg: err.message });
    });
  });

  /**
   * Get a single ability via it's name
   */
  app.get('/abilities/:name', async (req, res) => {
    const { name } = req.params;
    if (name) {
      let cmd = `SELECT * FROM abilities WHERE a_name = ? COLLATE NOCASE;`;
      await db.execGetCommand(cmd, path, [name]).then((data) => {
        res.status(200).send({ data });
      }).catch(err => {
        res.status(err.status).send({ msg: err.message });
      });
    } else {
      res.status(400).send({ msg: "You must specify an ability to search for." });
    }
  });
};