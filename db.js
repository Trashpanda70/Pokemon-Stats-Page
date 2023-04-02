const mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "pass"
});

async function connectToDB(query) {
  return await new Promise((resolve, reject) => {
    con.connect((err) => {
      if (err) {
        console.log("Error Connecting", err);
        reject(err);
      } else {
        console.log("CONNECTED!");
        //ex query: 'select * from todos.todolist'
        con.query(query, (err, res) => {
          if (err) {
            reject('Query failed');
          } else {
            resolve(res);
          }
        });
      }
    });
  });
}
