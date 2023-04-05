const sqlite3 = require('sqlite3').verbose();
const ServerError = require('../utils/ServerError');

let defaultPath = './db-files/todos.db';

//open database connection
function connect(path = defaultPath) {
  return new sqlite3.Database(path, (err) => {
    if (err) {
      console.error(`Error message below:\n${err.message}`);
      return false;
    }
  });
}

//close database connection
function close(db) {
  db.close((err) => {
    if (err) {
      console.error(`Error message below:\n${err.message}`);
      return false;
    }
    return true;
  });
}

/*
  db - database object
  command - sql command to execute as a string
  args - array of arguments to give to SQL command (replace ? in command)
*/
exports.execGetCommand = function execGetCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    let db = connect();
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
        if (!close(db))
          reject(new ServerError("Could not close database. Please report this."));
        resolve(row);
      });
    } catch (err) {
      if (!close(db))
        reject(new ServerError("Could not close database. Please report this."));
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
exports.execEachCommand = function execEachCommand(db, command, args = [], callback = () => { }) {
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
        if (!close(db))
          reject(new ServerError("Could not close database. Please report this."));
        resolve();
      } catch (err) {
        if (!close(db))
          reject(new ServerError("Could not close database. Please report this."));
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
exports.execAllCommand = function execAllCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    let db = connect();
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
        if (!close(db))
          reject(new ServerError("Could not close database. Please report this."));
        resolve(rows);
      });
    } catch (err) {
      if (!close(db))
        reject(new ServerError("Could not close database. Please report this."));
      reject(err);
    }
  });
};

// - all() method is used when you need to fetch and process all rows from the result set at once
// - each() method is used when you need to fetch and process each row from the result set one by one
// - get() method is used when you need to fetch and process only the first row from the result set

// Run a command without need for a return or success / fail
exports.runCommand = function runCommand(command) {
  exports.name = function name(args) {
    return new Promise((resolve, reject) => {
      let db = connect();
      if (!db)
        reject(new ServerError("Could not connect to database. Please report this."));
      try {
        if (!close(db))
          reject(new ServerError("Could not close database. Please report this."));
        db.run(command);
      } catch (err) {
        if (!close(db))
          reject(new ServerError("Could not close database. Please report this."));
        reject(err);
      }
    });
  };
};

// /* 
//   Insert data into the specified table
//   db - database object
//   table - table to insert into
//   columns - names of columns to insert data into
//   values - data to enter for each column, must be parallel array with columns
// */
// function insertData(db, table, columns, values) {
//   if (columns.length != values.length);
//   let cmdString = `INSERT INTO ${table}()`;
//   db.run();
// }
