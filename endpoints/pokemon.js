const { getTypeWeaknesses } = require('poke-types');
const { readPokemonNames } = require('../io/readYAML');

//const { noEffect, notVeryEffective, superEffective, ultraEffective } = require('poke-types/effectiveness');
const db = require('../database/db');

module.exports = function (app, path = "./database/db-files/pokemon.db") {
  /**
   * Get a single Pokemon via its name
   */
  app.get('/pokemon/:name', async (req, res) => {
    const { name } = req.params;
    if (name) {
      let cmd = `SELECT * FROM pokemon WHERE p_name = ?;`;
      await db.execGetCommand(cmd, path, [name]).then((data) => {
        res.status(200).send({ data });
      }).catch(err => {
        if (!err.status)
          err.status = 520;
        res.status(err.status).send({ msg: err.message });
      });
    } else {
      res.status(400).send({ msg: "You must specify a pokemon to search for." });
    }
  });

  /**
   * get all Pokemon
   * Can query for base stat total
   * - loweststats = lowest base stat total to search for
   * - stats = stat total to search for
   * - higheststats = highest stat total to search for
   */
  app.get('/pokemon', async (req, res) => {
    const q = req.query;
    let cmd = 'select * from pokemon;';
    await db.execAllCommand(cmd, path).then((data) => {
      //no query
      if (Object.keys(q).length == 0) {
        res.status(200).send({ data });
      } else {
        data = handleStatsQuery(q, data);
        //length 0 means nothing matches query
        if (data.length == 0) {
          res.status(404).send({ msg: `No Pokemon match base stat total query, or query was invalid.` });
        } else {
          res.status(200).send({ data });
        }
      }
    }).catch(err => {
      if (!err.status)
        err.status = 520;
      res.status(err.status).send({ msg: err.message });
    });
  });

  /**
   * get all Pokemon of a certain type
   * Can query for base stat total
   * - loweststats = lowest base stat total to search for
   * - stats = stat total to search for
   * - higheststats = highest stat total to search for
   */
  app.get('/pokemon/type/:type', async (req, res) => {
    const { type } = req.params;
    const q = req.query;
    if (type) {
      let cmd = "select * from pokemon where instr(p_types, ?) > 0;";
      await db.execAllCommand(cmd, path, [type]).then((data) => {
        //no query
        if (Object.keys(q).length == 0) {
          res.status(200).send({ data });
        } else {
          data = handleStatsQuery(q, data);
          //length 0 means nothing matches query
          if (data.length == 0) {
            res.status(404).send({ msg: `No ${type} type Pokemon match base stat total query, or query was invalid.` });
          } else {
            res.status(200).send({ data });
          }
        }
      }).catch(err => {
        if (!err.status)
          err.status = 520;
        res.status(err.status).send({ msg: err.message });
      });
    } else {
      res.status(400).send({ msg: "You must specify the type to filter by." });
    }
  });

  /**
   * Get the type defenses of a particular pokemon.
   */
  app.get('/pokemon/:name/defenses', async (req, res) => {
    const { name } = req.params;
    if (name) {
      let cmd = `SELECT * FROM pokemon WHERE p_name = ?;`;
      await db.execGetCommand(cmd, path, [name]).then((data) => {
        let types = data.p_types.split(',');
        let defenses = [];
        if (types.length == 1) {
          defenses = getTypeWeaknesses(types[0]);
        } else if (types.length == 2) {
          defenses = getTypeWeaknesses(types[0], types[1]);
        }
        if (Object.keys(defenses).length > 0) {
          res.status(200).send({ data: defenses });
        }
        else {
          res.status(500).send({ msg: `Pokemon ${name} has invalid type(s)` });
        }
      }).catch(err => {
        if (!err.status)
          err.status = 520;
        res.status(err.status).send({ msg: err.message });
      });
    } else {
      res.status(400).send({ msg: "You must specify a pokemon to search for." });
    }
  });


  app.get('/pokemon-names', async (req, res) => {
    const names = readPokemonNames();
    if (names.length && names.length > 0) {
      res.status(200).send({ data: names });
    } else {
      res.status(500).send({ msg: 'No names were able to be read' });
    }
  });
};

/**
 * handles base stat total query if it exists.
 * Takes in the query and the data returned by whatever initial database call happens.
 * Returns an array of data to then use as the return data instead of the original.
 * If the array returned is empty then no data matches the query.
 */
function handleStatsQuery(q, data) {
  //ensure only 1 query specified
  if (Object.keys(q).length != 1) {
    return [];
  }
  //ensure the query is legitimate
  if (!(q.higheststats || q.stats || q.loweststats)) {
    return [];
  }

  //filter for stats depending on query
  return data.filter((poke) => {
    //split stats into an array
    let stats = poke.p_base_stats.split(",");
    //stored as strings, need to convert to ints
    stats = stats.map((str) => {
      return parseInt(str);
    });
    //get sum of base stat totals
    let sum = stats.reduce((acc, curr) => {
      return curr + acc;
    }, 0);
    //determine if entry should be kept
    if (q.higheststats)
      return sum <= q.higheststats;
    if (q.stats)
      return sum == q.stats;
    if (q.loweststats)
      return sum >= q.loweststats;
    console.log(`stat total ${sum} did not fall under any category`);
    return false;
  });
}