const mysql = require('mysql2');
const fs = require('fs');

function readSQL(filePath) {
    const statement = fs.readFileSync(filePath).toString()
    return statement
}

async function sendQuery(fileName, options=null) {
    if (options) {
        let rows, fields;
        switch (options['type']) {
            case 'add_department':
                [rows, fields] = await db.promise().query(readSQL(`./db/${fileName}.sql`).replace('$<DEPARTMENT>', options['department_name']));
                return rows
            case 'add_role':
                [rows, fields] = await db.promise().query(readSQL(`./db/${fileName}.sql`)
                .replace('$<TITLE>', options['title'])
                .replace('$<SALARY>', options['salary'])
                .replace('$<DEPARTMENT_ID>', options['department_id'])
                );
                return rows
            case 'add_employee':
                [rows, fields] = await db.promise().query(readSQL(`./db/${fileName}.sql`)
                .replace('$<FIRSTNAME>', options['first_name'])
                .replace('$<LASTNAME>', options['last_name'])
                .replace('$<ROLE_ID>', options['role_id'])
                .replace('$<MANAGERNAME>', options['manager_name'])
                );
                return rows
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

async function addRole(title, salary, department_id) {
    const data = await sendQuery('addRole', {'type': 'add_role', 'title': title, 'salary': salary, 'department_id': department_id})
}

async function addEmployee(first_name, last_name, role_id, manager_name=null) {
    const data = await sendQuery('addEmployee', {'type': 'add_employee', 'first_name': first_name, 'last_name': last_name, 'role_id': role_id, 'manager_name': manager_name})
}

module.exports = {pullDepartments, pullRoles, pullEmployees, addDepartment, addRole, addEmployee}