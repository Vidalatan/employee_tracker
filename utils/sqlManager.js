const mysql = require('mysql2');
const fs = require('fs');

function readSQL(filePath) {
    const statement = fs.readFileSync(filePath).toString()
    return statement
}

async function sendQuery(fileName, options=null) {
    if (options) {
        switch (options['type']) {
            case 'add_department':
                let [rows, fields] = await db.promise().query(readSQL(`./db/${fileName}.sql`).replace('$<DEPARTMENT>', options['department_name']));
                return rows
            case 'department':
                
                break;
            case 'department':
                
                break;
            case 'department':
                
                break;
        }
    } else {
        let [rows, fields] = await db.promise().query(readSQL(`./db/${fileName}.sql`));
        return rows
    }
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

async function addDepartment(department_name) {
    const data = await sendQuery('addDepartment', {'type': 'add_department', 'department_name': department_name})
}

module.exports = {pullDepartments, pullRoles, pullEmployees, addDepartment}