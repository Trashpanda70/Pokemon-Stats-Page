const sqlite3 = require('sqlite3').verbose();
const ServerError = require('./utils/ServerError');

let defaultPath = './db/Database.db';

//open database connection
function connect(path = defaultPath) {
  return new sqlite3.Database(path, (err) => {
    if (err) {
      return console.error(`An error occured connecting to database. Please try again or report this. Message below:\n${err.message}`);
    }
    console.log('Connected to database!');
  });
}

//close database connection
function close(db) {
  db.close((err) => {
    if (err) {
      return console.error(`An error occured closing the database. Please report this. Message below:\n${err.message}`);
    }
    console.log('Connection to database closed');
  });
}

/*
  db - database object
  command - sql command to execute as a string
  callback - the callback function to pass to db.get
  args - array of arguments to give to SQL command (replace ? in command)
*/
function execGetCommand(db, command, callback, args = []) {
  //https://stackoverflow.com/questions/13286233
  if (command.match(/\?/g) != args.length)
    throw new ServerError("Not enough arguments given for get query", 400);
  db.get(command, args, callback);
}

/*
  db is database object
  command is sql command to execute as a string
  callback is the callback function to pass to db.get
  args is array of arguments to give to SQL command (replace ? in command)
*/
function execEachCommand(db, command, args = [], callback = () => { }) {
  throw new ServerError("'each' command not implemented yet", 501);
  // if (command.match(/\?/g) != args.length)
  //   throw new ServerError("Not enough arguments given for get query", 400);
  // db.each(command, args, callback);
}

/*
  db is database object
  command is sql command to execute as a string
  callback is the callback function to pass to db.get
  args is array of arguments to give to SQL command (replace ? in command)
*/
function execAllCommand(db, command, args = []) {
  if (command.match(/\?/g) != args.length)
    throw new ServerError("Not enough arguments given for get query", 400);
  return new Promise((resolve, reject) => {
    db.all(command, args, (err, rows) => {
      if (err) {
        reject(err);
      }
      if (rows.length == 0) {
        reject(new ServerError('No matches found', 404));
      }
      resolve(rows);
    });
  });
}

// - all() method is used when you need to fetch and process all rows from the result set at once
// - each() method is used when you need to fetch and process each row from the result set one by one
// - get() method is used when you need to fetch and process only the first row from the result set

// Run a command without need for a return or success / fail
function runCommand(db, command) {
  db.run(command);
}

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




module.exports = {
  connect,
  close,
  execGetCommand,
  execEachCommand,
  execAllCommand,
  runCommand
};