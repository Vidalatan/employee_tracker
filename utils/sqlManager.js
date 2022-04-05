const mysql = require('mysql2');
const fs = require('fs')

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
        let preparedStatement = readSQL('./db/schema.sql')
        db.query(preparedStatement, (err, result) => err && console.error(err))
    })()
})

function readSQL(filePath) {
    const statement = fs.readFileSync(filePath).toString()
    return statement
}

function pullDepartments() {

}

function pullRoles() {

}

function pullEmployees() {

}

module.exports = {pullDepartments, pullRoles, pullEmployees}