const { getTypeWeaknesses } = require('poke-types');
const { noEffect, notVeryEffective, superEffective, ultraEffective } = require('poke-types/effectiveness');
const db = require('../database/db');


module.exports = function (app) {
  //get all moves
  app.get('/moves', async (req, res) => {
    let cmd = 'select * from moves;';
    await db.execAllCommand(cmd).then(data => {
      console.log(data);
      res.status(200).send({ data });
    }).catch(err => {
      res.status(err.status).send({ msg: err.message });
    });
  });
};



// if (this.types[1])
//   return getTypeWeaknesses(this.types[0]);
// return getTypeWeaknesses(this.types[0], this.types[1]);