const sqlite3 = require('sqlite3').verbose();
const ServerError = require('../utils/ServerError');
const util = require('../utils/UtilityFunctions');

exports.moveColumns = ['m_name',
  'm_type',
  'm_category',
  'm_power',
  'm_accuracy',
  'm_pp',
  'm_description'];

exports.pokeColumns = ['p_name',
  'p_types',
  'p_base_stats',
  'p_evs',
  'p_abilities',
  'p_hidden_abilities',
  'p_move_levels',
  'p_moves',
  'p_tutor_moves',
  'p_egg_moves',
  'p_egg_groups'];

/* ----------------------------- OPEN/CLOSE OPERATIONS ----------------------------- */
/** open database connection*/
function connect(path) {
  return new sqlite3.Database(path, (err) => {
    if (err) {
      console.error(`Error message below:\n${err.message}`);
      return false;
    }
  });
}

/** close database connection */
async function close(db) {
  return await new Promise((resolve, reject) =>
    db.close((err) => {
      if (err) {
        console.error(`Error message below:\n${err.message}`);
        reject(err);
      }
      resolve();
    }));
}

/* ----------------------------- GET OPERATIONS ----------------------------- */
/**
  command - sql command to execute as a string
  args - array of arguments to give to SQL command (replace ? in command)
  path - path to db file
*/
exports.execGetCommand = (command, path, args = []) => {
  return new Promise((resolve, reject) => {
    let db = connect(path);
    if (!db)
      reject(new ServerError("Could not connect to database. Please report this."));
    try {
      let matches = command.match(/\?/g);
      if (matches && matches.length != args.length)
        reject(new ServerError("Wrong number of arguments provided for given query. Please report this.", 500));
      db.get(command, args, (err, row) => {
        if (err) {
          reject(err);
        }
        if (!row) {
          reject(new ServerError("No data found for given command.", 404));
        }
        close(db).catch(err => { reject(new ServerError(err)); });
        resolve(row);
      });
    } catch (err) {
      close(db).catch(err => { reject(new ServerError(err)); });
      reject(err);
    }
  });
};

/**
  command is sql command to execute as a string
  callback is the callback function to pass to db.get
  args is array of arguments to give to SQL command (replace ? in command)
*/
exports.execAllCommand = (command, path, args = []) => {
  return new Promise((resolve, reject) => {
    let db = connect(path);
    if (!db)
      reject(new ServerError("Could not connect to database. Please report this."));
    try {
      let matches = command.match(/\?/g);
      if (matches && matches.length != args.length)
        reject(new ServerError("Wrong number of arguments provided for given query. Please report this.", 500));
      db.all(command, args, (err, rows) => {
        if (err) {
          reject(err);
        }
        if (rows.length == 0) {
          reject(new ServerError("No data found for given command.", 404));
        }
        close(db).then(() => {
          resolve(rows);
        }).catch(err => {
          reject(new ServerError(err));
        });
        //resolve(rows);
      });
    } catch (err) {
      close(db).catch(err => { reject(new ServerError(err)); });
      reject(err);
    }
  });
};

/* ----------------------------- GENERAL RUN OPERATION ----------------------------- */
/** Run a command without need for a return or success / fail */
exports.runCommand = (command, path) => {
  return new Promise((resolve, reject) => {
    let db = connect(path);
    if (!db)
      reject(new ServerError("Could not connect to database. Please report this."));
    try {
      db.run(command, [], (err) => {
        if (err)
          reject(err);
      });
      close(db).catch(err => { reject(new ServerError(err)); });
      resolve();
    } catch (err) {
      close(db).catch(err => { reject(new ServerError(err)); });
      reject(err);
    }
  });
};

/* ----------------------------- POST (add new) OPERATIONS ----------------------------- */
/**
  Insert data into the specified table
  table - table to insert into
  columns - names of columns to insert data into
  values - data to enter for each column, must be parallel array with columns
  placeholders - whether ? placeholders are used or not
  Example of what the command is doing:
  INSERT INTO table1 (height, color, ...) VALUES (50, blue , ...)
*/
exports.insertDataRow = (table, columns, values, path, placeholders = false) => {
  return new Promise((resolve, reject) => {
    let db = connect(path);
    if (!db)
      reject(new ServerError("Could not connect to database. Please report this."));
    try {
      if (columns.length != values.length)
        reject(new ServerError("Command did not provide same number of columns and values to insert", 400));
      //prepare values and placeholders
      let vals = '(' + values.map((v) => v).join(',') + ')';
      let cols = '(' + columns.map((c) => c).join(',') + ')';
      //using placeholders?
      let param = placeholders ? values : [];
      //call to actual function
      let sql = `INSERT INTO ${table} ${cols} VALUES ${vals};`;
      db.run(sql, param, (err) => {
        if (err)
          reject(err);
      });
      close(db).catch(err => { reject(new ServerError(err)); });
      resolve();
    } catch (err) {
      close(db).catch(err => { reject(new ServerError(err)); });
      reject(err);
    }
  });
};

/** 
  Insert multiple data rows into the specified table
  table - table to insert into
  columns - names of columns to insert data into
  values - data to enter for each column, must have the same number of columns as the columns field
           the number of rows is equal to the number of entries to make
  placeholders - whether ? placeholders are used or not
  Example of what the command is doing:
  INSERT INTO table1 (height, color, ...) VALUES (50, blue , ...), (45, red, ...), ...
*/
exports.insertDataManyRows = (table, columns, values, path, placeholders = false) => {
  return new Promise((resolve, reject) => {
    let db = connect(path);
    if (!db)
      reject(new ServerError("Could not connect to database. Please report this."));
    try {
      if (util.isJagged(values))
        reject(new ServerError("Values array is jagged, not all rows have the same amount of entries", 400));
      if (columns.length != values[0].length)
        reject(new ServerError("Command did not provide same number of columns and values to insert", 400));
      //prepare values and columns (no sql-injection protection unlike insertDataRow)
      let vals = "";
      for (const arr of values) {
        vals += '(' + arr.map((c) => c).join(',') + '),';
      }
      vals = vals.substring(0, vals.length - 1);
      let cols = '(' + columns.map((c) => c).join(',') + ')';
      //using placeholders?
      let param = placeholders ? values : [];
      //call to actual function
      let sql = `INSERT INTO ${table} ${cols} VALUES ${vals};`;
      //console.log(sql);
      db.run(sql, param, (err) => {
        if (err)
          reject(err);
      });
      close(db).catch(err => { reject(new ServerError(err)); });
      resolve();
    } catch (err) {
      close(db).catch(err => { reject(new ServerError(err)); });
      reject(err);
    }
  });
};


/* ----------------------------- PUT (update) OPERATIONS ----------------------------- */
/** 
  Update a single element of data, or multiple elements depending on the value of condition. Uses wildcards for the
  values for sanitization
  table - table to perform the update on
  cols - names of columns to update the data of (array)
  values - data to use for updating, must be the same length as the cols array
  condition - A string representing the condition to use for the update. If one is not specified or a falsy value
  is given, then the update goes for all rows of the table. NOTE: Do not include the 'WHERE' keyword, it will be added.
  Example of what the command is doing:
  UPDATE table SET cols[0] = values[0], 
                   cols[1] = values[1],
                   ...
               WHERE condition
*/
exports.updateData = (table, columns, values, path, condition = null) => {
  return new Promise((resolve, reject) => {
    let db = connect(path);
    if (!db)
      reject(new ServerError("Could not connect to database. Please report this."));
    try {
      //ensure cols and values are arrays with the same length
      if (!util.haveSameLength(columns, values)) {
        reject(new ServerError("Command did not provide same number of columns and values to insert", 400));
      }
      //prepare cols and values
      let vals = values.map((v) => `?,`);
      vals[vals.length - 1] = vals[vals.length - 1].substring(0, 1);
      let cols = columns.map((c) => `${c} = `);
      //for each element in array 1, accumulate into an initially empty string the current value processed and the necessary
      //vals array value at the same index. 
      const setString = cols.reduce((acc, curr, index) => acc + curr + vals[index], '');
      const conditionString = condition ? `WHERE ${condition}` : '';
      //build sql command and run
      let sql = `UPDATE ${table} SET ${setString} ${conditionString};`;
      console.log(sql);
      db.run(sql, values, (err) => {
        if (err)
          reject(err);
      });
      close(db).catch(err => { reject(new ServerError(err)); });
      resolve();
    } catch (err) {
      close(db).catch(err => { reject(new ServerError(err)); });
      reject(err);
    }
  });
};

/* ----------------------------- DELETE (delete) OPERATIONS ----------------------------- */
exports.deleteData = (table, path, all = true) => {
  return new Promise((resolve, reject) => {
    let db = connect(path);
    if (!db)
      reject(new ServerError("Could not connect to database. Please report this."));
    try {
      if (all) {
        db.serialize(() => {
          db.run(`DELETE FROM ${table};`, [], (err) => {
            if (err)
              reject(err);
          });
          db.run(`VACUUM;`, [], (err) => {
            if (err)
              reject(err);
          });
        });
        resolve();
      }
      reject(new ServerError("Cannot delete specific rows yet", 501));
      close(db).catch(err => { reject(new ServerError(err)); });
      resolve();
    } catch (err) {
      close(db).catch(err => { reject(new ServerError(err)); });
      reject(err);
    }
  });
};

