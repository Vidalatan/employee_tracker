const mysql = require('mysql2');
const fs = require('fs');

function readSQL(filePath) {
    const statement = fs.readFileSync(filePath).toString()
    return statement
}

async function sendQuery(fileName) {
    let [rows, fields] = await db.promise().query(readSQL(`./db/${fileName}.sql`));
    return rows
}

const db = mysql.createConnection(
    {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      rowsAsArray: true,
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


async function pullDepartments() {
    const data = await sendQuery('pullDepartments');
    return data;
}

async function pullRoles() {
    const data = await sendQuery('pullRoles');
    return data;
}

async function pullEmployees() {
    const data = await sendQuery('pullEmployees');
    return data;
}

module.exports = {pullDepartments, pullRoles, pullEmployees}