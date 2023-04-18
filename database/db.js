const sqlite3 = require('sqlite3').verbose();
const ServerError = require('../utils/ServerError');
const util = require('../utils/UtilityFunctions');

let defaultPath = './db-files/todos.db';

/* ----------------------------- OPEN/CLOSE OPERATIONS ----------------------------- */
//open database connection
function connect(path) {
  return new sqlite3.Database(path, (err) => {
    if (err) {
      console.error(`Error message below:\n${err.message}`);
      return false;
    }
  });
}

//close database connection
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
/*
  db - database object
  command - sql command to execute as a string
  args - array of arguments to give to SQL command (replace ? in command)
  path - path to db file
*/
exports.execGetCommand = (command, args = [], path = defaultPath) => {
  return new Promise((resolve, reject) => {
    let db = connect(path);
    if (!db)
      reject(new ServerError("Could not connect to database. Please report this."));
    try {
      let matches = command.match(/\?/g);
      if (matches && matches != args.length)
        throw new ServerError("Wrong number of arguments provided for given query. Please report this.", 500);
      db.get(command, args, (err, row) => {
        if (err) {
          reject(err);
        }
        if (!row) {
          throw new ServerError("No data found for given command.", 404);
        }
        close(db).catch(err => { throw new ServerError(err); });
        resolve(row);
      });
    } catch (err) {
      close(db).catch(err => { throw new ServerError(err); });
      reject(err);
    }
  });
};

/*
  db is database object
  command is sql command to execute as a string
  callback is the callback function to pass to db.get
  args is array of arguments to give to SQL command (replace ? in command)
*/
/* eslint-disable -- This method is serving as a temporary skelton for other similar methods*/
exports.execEachCommand = (db, command, args = [], callback = () => { }) => {
  throw new ServerError("'each' command not implemented yet", 501);

  exports.name = function name(args) {
    return new Promise((resolve, reject) => {
      let db = connect();
      if (!db)
        reject(new ServerError("Could not connect to database. Please report this."));
      try {
        //use below 3 lines if using args array to fill "?" chars in SQL statement
        let matches = command.match(/\?/g);
        if (matches && matches != args.length)
          throw new ServerError("Wrong number of arguments provided for given query. Please report this.", 500);
        //call to actual function
        //...
        close(db).catch(err => { throw new ServerError(err); });
        resolve();
      } catch (err) {
        close(db).catch(err => { throw new ServerError(err); });
        reject(err);
      }
    });
  };
};
/* eslint-enable */

/*
  db is database object
  command is sql command to execute as a string
  callback is the callback function to pass to db.get
  args is array of arguments to give to SQL command (replace ? in command)
*/
exports.execAllCommand = (command, args = [], path = defaultPath) => {
  return new Promise((resolve, reject) => {
    let db = connect(path);
    if (!db)
      reject(new ServerError("Could not connect to database. Please report this."));
    try {
      let matches = command.match(/\?/g);
      if (matches && matches != args.length)
        throw new ServerError("Wrong number of arguments provided for given query. Please report this.", 500);
      db.all(command, args, (err, rows) => {
        if (err) {
          reject(err);
        }
        if (rows.length == 0) {
          throw new ServerError("No data found for given command.", 404);
        }
        close(db).then(() => {
          resolve(rows);
        }).catch(err => {
          throw new ServerError(err);
        });
        //resolve(rows);
      });
    } catch (err) {
      close(db).catch(err => { throw new ServerError(err); });
      reject(err);
    }
  });
};

// - all() method is used when you need to fetch and process all rows from the result set at once
// - each() method is used when you need to fetch and process each row from the result set one by one
// - get() method is used when you need to fetch and process only the first row from the result set

/* ----------------------------- GENERAL RUN OPERATION ----------------------------- */
// Run a command without need for a return or success / fail
exports.runCommand = (command, path = defaultPath) => {
  exports.name = function name(args) {
    return new Promise((resolve, reject) => {
      let db = connect(path);
      if (!db)
        reject(new ServerError("Could not connect to database. Please report this."));
      try {
        close(db).catch(err => { throw new ServerError(err); });
        db.run(command).catch((err) => {
          if (err)
            reject(err);
        });
      } catch (err) {
        close(db).catch(err => { throw new ServerError(err); });
        reject(err);
      }
    });
  };
};

/* ----------------------------- POST (add new) OPERATIONS ----------------------------- */
/* 
  Insert data into the specified table
  db - database object
  table - table to insert into
  columns - names of columns to insert data into
  values - data to enter for each column, must be parallel array with columns
  Example of what the command is doing:
  INSERT INTO table1 (height, color, ...) VALUES (50, blue , ...)
*/
exports.insertDataRow = (table, columns, values, path = defaultPath) => {
  return new Promise((resolve, reject) => {
    let db = connect(path);
    if (!db)
      reject(new ServerError("Could not connect to database. Please report this."));
    try {
      if (columns.length != values.length)
        reject(new ServerError("Command did not provide same number of columns and values to insert", 400));
      //prepare values and placeholders
      let placeholders = '(' + values.map((v) => v).join(',') + ')';
      let cols = '(' + columns.map((c) => c).join(',') + ')';
      //call to actual function
      db.run(`INSERT INTO ${table} ${cols} VALUES ${placeholders}`, values).catch((err) => {
        if (err)
          reject(err);
      });
      close(db).catch(err => { throw new ServerError(err); });
      resolve();
    } catch (err) {
      close(db).catch(err => { throw new ServerError(err); });
      reject(err);
    }
  });
};

/* 
  Insert multiple data rows into the specified table
  db - database object
  table - table to insert into
  columns - names of columns to insert data into
  values - data to enter for each column, must have the same number of columns as the columns field
           the number of rows is equal to the number of entries to make
  Example of what the command is doing:
  INSERT INTO table1 (height, color, ...) VALUES (50, blue , ...), (45, red, ...), ...
*/
exports.insertDataManyRows = (table, columns, values, path = defaultPath) => {
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
      //call to actual function
      db.run(`INSERT INTO ${table} ${cols} VALUES ${vals}`, values).catch((err) => {
        if (err)
          reject(err);
      });
      close(db).catch(err => { throw new ServerError(err); });
      resolve();
    } catch (err) {
      close(db).catch(err => { throw new ServerError(err); });
      reject(err);
    }
  });
};


/* ----------------------------- PUT (update) OPERATIONS ----------------------------- */
exports.updateData = (table, path = defaultPath) => {
  return new Promise((resolve, reject) => {
    let db = connect();
    if (!db)
      reject(new ServerError("Could not connect to database. Please report this."));
    try {
      reject(new ServerError("Update Endpoint not implemented yet", 501));
      close(db).catch(err => { throw new ServerError(err); });
      resolve();
    } catch (err) {
      close(db).catch(err => { throw new ServerError(err); });
      reject(err);
    }
  });
};

/* ----------------------------- DELETE (delete) OPERATIONS ----------------------------- */
exports.deleteData = (table, all = false, path = defaultPath) => {
  return new Promise((resolve, reject) => {
    let db = connect();
    if (!db)
      reject(new ServerError("Could not connect to database. Please report this."));
    try {
      if (all) {
        db.run(`DELETE FROM ${table}`).catch((err) => {
          if (err)
            reject(err);
        });
        db.run(`VACUUM`).catch((err) => {
          if (err)
            reject(err);
        });
        resolve();
      }
      reject(new ServerError("Cannot delete specific rows yet", 501));
      close(db).catch(err => { throw new ServerError(err); });
      resolve();
    } catch (err) {
      close(db).catch(err => { throw new ServerError(err); });
      reject(err);
    }
  });
};

