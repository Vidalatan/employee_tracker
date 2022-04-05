const mysql = require('mysql2');
const fs = require('fs');

function readSQL(filePath) {
    const statement = fs.readFileSync(filePath).toString()
    return statement
}

function sendQuery(fileName, expectsResults=false) {
    let data;
    db.query(readSQL(`./db/${fileName}.sql`), (err, results) => err ? 
    console.error(err) : data=results)
    return data
}

const db = mysql.createConnection(
    {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    },
    console.log(`Connected to DB`)
  );
  
db.connect(function(err) {
    err ? console.error(err) : (() => {
        sendQuery('schema');  // Creates the DB
        sendQuery('seeds'); // Preset values to get the DB started
    })()
})


function pullDepartments() {
    sendQuery('')
}

function pullRoles() {

}

function pullEmployees() {

}

module.exports = {pullDepartments, pullRoles, pullEmployees}