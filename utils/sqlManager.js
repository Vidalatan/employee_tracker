const mysql = require('mysql2');
const chalk = require('chalk');
const fs = require('fs');

/**
 * Used to take the information from a file and turn it into a string
 * @param {string} filePath 
 * @returns String of the data in the file passed in
 */
function readSQL(filePath) {
    const statement = fs.readFileSync(filePath).toString()
    return statement
}

/**
 * Acts as a handler for sql queries. Uses readSQL to get the data from the db
 * directory, then turns it into a sql query and replaces parts with passed in 
 * options depending on query
 * @param {string} fileName 
 * @param {object} options 
 * @returns String of data from database
 */
async function sendQuery(fileName, options=null) {
    if (options) {
        let data, fields;
        switch (options['type']) {
            // Executes addDepartment.sql and inserts given department name
            case 'add_department':
                [data, fields] = await db.promise().query(readSQL(`./db/${fileName}.sql`).replace('$<DEPARTMENT>', options['department_name']));
                return data
            // Executes addRole.sql and inserts given title, salary, and department id
            case 'add_role':
                [data, fields] = await db.promise().query(readSQL(`./db/${fileName}.sql`)
                .replace('$<TITLE>', options['title'])
                .replace('$<SALARY>', options['salary'])
                .replace('$<DEPARTMENT_ID>', options['department_id'])
                );
                return data
            // Executes addEmployee.sql and inserts given first and last name, role id, and manager name
            case 'add_employee':
                [data, fields] = await db.promise().query(readSQL(`./db/${fileName}.sql`)
                .replace('$<FIRSTNAME>', options['first_name'])
                .replace('$<LASTNAME>', options['last_name'])
                .replace('$<ROLE_ID>', options['role_id'])
                .replace(options['manager_name'] ? '$<MANAGERNAME>' : `'$<MANAGERNAME>'`, options['manager_name'])
                );
                return data
            // Executes delDepartment.sql and removes department using department id
            case 'del_department':
                try {
                    [data, fields] = await db.promise().query(readSQL(`./db/${fileName}.sql`)
                    .replace('$<DEPT_ID>', options['dept_id'])
                    );
                    return data
                } catch (error) {
                    // Catch block executes if database cannot delete the role due to the foreign key
                    return null
                }
            // Executes delRole.sql and removes role using role id
            case 'del_role':
                try {
                    [data, fields] = await db.promise().query(readSQL(`./db/${fileName}.sql`)
                    .replace('$<ROLE_ID>', options['role_id'])
                    );
                    return data
                } catch (error) {
                    // Catch block executes if database cannot delete the role due to the foreign key
                    return null
                }
            // Executes delEmployee.sql and removes employee using employee id
            case 'del_employee':
                [data, fields] = await db.promise().query(readSQL(`./db/${fileName}.sql`)
                .replace('$<EMP_ID>', options['emp_id'])
                );
                return data
            // Executes updateEmployee.sql and updates the role and/or manager
            case 'update_employee':
                [data, fields] = await db.promise().query(readSQL(`./db/${fileName}.sql`)
                .replace('$<EMP_ID>', options['emp_id'])
                .replace('$<ROLE_ID>', options['role_id'])
                .replace(options['manager_name'] ? '$<MANAGERNAME>' : `'$<MANAGERNAME>'`, options['manager_name'])
                )

        }
    } else {  // This is the catch all for regular queries that don't modify, but request data
        let [data, fields] = await db.promise().query(readSQL(`./db/${fileName}.sql`));
        return data
    }
}

// Create the connection
const db = mysql.createConnection(
    {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      rowsAsArray: true,
      multipleStatements: true
    }
  );
  
// connect to a database that is also created and seeded within the connection definition itself
db.connect(function(err) {
    err ? console.error(err) : (() => {
        sendQuery('schema');  // Creates the DB
        sendQuery('seeds'); // Preset values to get the DB started
    })()
})

// Bellow are all the functions that initiate sendQuery to execute one of the .sql files
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

async function delDepartment(dept_id) {
    const data = await sendQuery('delDepartment', {'type': 'del_department', 'dept_id': dept_id})
    if (data === null) {
        console.log(chalk.redBright('CANNOT DELETE DEPARTMENT\n') + 
        chalk.yellow("There are roles, or employees assigned to this department\nYou must first update/remove anything assigned to this department"));
    }
}

async function delRole(role_id) {
    const data = await sendQuery('delRole', {'type': 'del_role', 'role_id': role_id})
    if (data === null) {
        console.log(chalk.redBright('CANNOT DELETE ROLE\n') + 
        chalk.yellow("There are employees assigned to this role still.\nYou must first update/remove anyone assigned to this role"));
    }
}

async function delEmployee(emp_id) {
    const data = await sendQuery('delEmployee', {'type': 'del_employee', 'emp_id': emp_id})
}

async function updateEmployee(emp_id, role_id, manager_name) {
    const data = await sendQuery('updateEmployee', {'type': 'update_employee', 'emp_id': emp_id, 'role_id': role_id, 'manager_name': manager_name})
}

module.exports = 
{
    pullDepartments, pullRoles, pullEmployees, 
    addDepartment, addRole, addEmployee, 
    delDepartment, delRole, delEmployee,
    updateEmployee}