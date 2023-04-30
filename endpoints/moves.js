const db = require('../database/db');

//Specify path for testing, default will be the database file
module.exports = function (app, path = "./database/db-files/moves.db") {

  /**
   * Get a single move via it's name
   */
  app.get('/moves/:name', async (req, res) => {
    const { name } = req.params;
    if (name) {
      let cmd = `SELECT * FROM moves WHERE m_name = ?;`;
      await db.execGetCommand(cmd, path, [name]).then((data) => {
        res.status(200).send({ data });
      }).catch(err => {
        res.status(err.status).send({ msg: err.message });
      });
    } else {
      res.status(400).send({ msg: "You must specify a move to search for." });
    }
  });

  /**
   * GET Multiple moves. Possible queries are below:
   * - type: the type of the move
   * - category: the category of the move (special, physical, status)
   * POWER (mutually exclusive)
   * - minpower: all moves at or above a certain power
   * - power: all moves of a certain power 
   * - maxpower: all moves below a certain power 
   * ACCURACY (mutually exclusive)
   * - minaccuracy: all moves at or above a certain accuracy
   * - accuracy: all moves at a certain accuracy
   * - maxaccuracy: all moves at or below a certain accuracy
   * PP (mutually exclusive)
   * - minpp: all moves at or above a certain amount of pp
   * - pp: all moves at a certain pp
   * - maxpp: all moves at or below a certain pp
   */
  app.get('/moves', async (req, res) => {
    const q = req.query;
    //preconditions for queries
    if (q.minpp && q.maxpp || q.minpp && q.pp || q.pp && q.maxpp) {
      res.status(400).send({ msg: "Please only specify one pp parameter " });
      return;
    }
    if (q.minpower && q.maxpower || q.minpower && q.power || q.power && q.maxpower) {
      res.status(400).send({ msg: "Please only specify one power parameter " });
      return;
    }
    if (q.minaccuracy && q.maxaccuracy || q.minaccuracy && q.accuracy || q.accuracy && q.maxaccuracy) {
      res.status(400).send({ msg: "Please only specify one accuracy parameter " });
      return;
    }
    //handle queries
    const arr = getWhereString(q);
    //no queries (or proper queries) given
    if (arr[1].length == 0) {
      let cmd = 'select * from moves;';
      await db.execAllCommand(cmd, path).then(data => {
        res.status(200).send({ data });
      }).catch(err => {
        res.status(err.status).send({ msg: err.message });
      });
    } else {
      let cmd = `SELECT * FROM moves ${arr[0]};`;
      await db.execAllCommand(cmd, path, arr[1]).then(data => {
        res.status(200).send({ data });
      }).catch(err => {
        res.status(err.status).send({ msg: err.message });
      });
    }
  });
};

/**
 * Returns an array with the string to use in the command (WHERE ___) as the first index
 * and the array of values to replace wildcards in the second.
 */
function getWhereString(q) {
  //no queries
  if (Object.keys(q).length === 0) {
    return ['', []];
  }
  let strEntries = [];
  let valueEntries = [];
  if (q.type) {
    valueEntries.push(q.type);
    strEntries.push('m_type = ?');
  }
  if (q.category) {
    valueEntries.push(q.category);
    strEntries.push('m_category = ?');
  }
  if (q.minpower) {
    valueEntries.push(q.minpower);
    strEntries.push('m_power >= ?');
  } else if (q.power) {
    valueEntries.push(q.power);
    strEntries.push('m_power = ?');
  } else if (q.maxPower) {
    valueEntries.push(q.maxPower);
    strEntries.push('m_power <= ?');
  }
  if (q.minpp) {
    valueEntries.push(q.minpp);
    strEntries.push('m_pp >= ?');
  } else if (q.pp) {
    valueEntries.push(q.pp);
    strEntries.push('m_pp = ?');
  } else if (q.maxpp) {
    valueEntries.push(q.maxpp);
    strEntries.push('m_pp <= ?');
  }
  if (q.minaccuracy) {
    valueEntries.push(q.minaccuracy);
    strEntries.push('m_accuracy >= ?');
  } else if (q.accuracy) {
    valueEntries.push(q.accuracy);
    strEntries.push('m_accuracy = ?');
  } else if (q.maxaccuracy) {
    valueEntries.push(q.maxaccuracy);
    strEntries.push('m_accuracy <= ?');
  }
  //compile the where clause. 
  let str = strEntries.reduce((acc, curr, i) => {
    if (i == strEntries.length - 1) return `${acc}${curr}`;
    return `${acc}${curr} AND `;
  }, 'WHERE ');
  //return array with string as first index and values as second. scuffed but secure.
  return [str, valueEntries];
  /*
    Above uses the reduce function to do the job of a for loop.
    loops through all entries in strEntries and executes the callback on each one, accumulating it to the acc string
    which starts as 'WHERE '. curr is the current item being traversed through the array.
  */
}

// if (this.types[1])
//   return getTypeWeaknesses(this.types[0]);
// return getTypeWeaknesses(this.types[0], this.types[1]);