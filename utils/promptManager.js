const inquirer = require('inquirer');
const chalk = require('chalk');
const pressAnyKey = require('press-any-key');
const cTable = require('console.table');
const sql = require('./sqlManager')

/**
 * Prints banner to terminal and holds user
 */
async function introHolder() {
    console.log(chalk.green(
        '','=========================================\n',
        '| Welcome to the Employee Tracking App! |\n',
        '=========================================\n'));
    return await pressAnyKey('      Please press any key to start\n(Or \'ctrl+c\' to exit the app at any time)')
}

/**
 * Main method of determining what the user wishes to do
 */
async function menuOptions() {
    const {option} = await inquirer.prompt({
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: 
        [
            {value: 'view', name: 'View'},
            {value: 'add', name: 'Add'},
            {value: 'del', name: 'Delete'},
            {value: 'uemp', name: 'Update Employee'}
        ]
    })
    // First switch. Determines if user wants to view, add, delete, or update
    switch (option) {
        case 'view':
            return await selectView()
        case 'add':
            return await selectAdd()
        case 'del':
            return await selectDel()
        case 'uemp':
            return 'uemp'
    }
    
}

// Switch for view options. Determines if viewing Departments, Roles, or Employees
async function selectView() {
    const {option} = await inquirer.prompt({
        type: 'list',
        name: 'option',
        message: 'What would you like to view? ',
        choices: 
        [
            {value: 'vdep', name: 'View Departments'},
            {value: 'vrol', name: 'View Roles'},
            {value: 'vemp', name: 'View Employees'}
        ]
    })
    return option
}

// Switch for add options. Determines if adding Department, Role, or Employee
async function selectAdd() {
    const {option} = await inquirer.prompt({
        type: 'list',
        name: 'option',
        message: 'What would you like to add? ',
        choices: 
        [
            {value: 'adep', name: 'Add Department'},
            {value: 'arol', name: 'Add Role'},
            {value: 'aemp', name: 'Add Employee'},
        ]
    })
    return option
}

// Switch for delete options. Determines if deleting Department, Role, or Employee
async function selectDel() {
    const {option} = await inquirer.prompt({
        type: 'list',
        name: 'option',
        message: 'What would you like to Delete? ',
        choices: 
        [
            {value: 'ddep', name: 'Delete Department'},
            {value: 'drol', name: 'Delete Role'},
            {value: 'demp', name: 'Delete Employee'},
        ]
    })
    return option
}

/**
 * Asks user if they wish to display a table relevant to the action they just took
 * @param {string} newThing 
 * @returns boolean
 */
async function willRedisplay(newThing) {
    const {willRedisplay} = await inquirer.prompt({
        type: 'confirm',
        name: 'willRedisplay',
        message: `Do you wish to display the table containing your ${newThing}`
    })
    return willRedisplay
}

/**
 * Prints table containing information for Departments
 * @returns Prompt Holder
 */
async function viewDepartments() {
    console.table(
        [
            chalk.yellow('Department ID'), // Array for setting column names and colors
            chalk.yellow('Departments')
        ], await sql.pullDepartments())
    return await pressAnyKey('Please press any key to continue\n')
}

/**
 * Prints table containing information for Roles
 * @returns Prompt Holder
 */
async function viewRoles() {
    console.table(
        [
            chalk.blueBright('Role'),
            chalk.blueBright('Role ID'), // Array for setting column names and colors
            chalk.yellow('Department'),
            chalk.green('Salary'),
        ], await sql.pullRoles())
    return await pressAnyKey('Please press any key to continue\n')
}

/**
 * Prints table containing information for Employees
 * @returns Prompt Holder
 */
async function viewEmployees() {
    console.table(
        [
            chalk.magenta('Employee ID'),
            chalk.magenta('First Name'),
            chalk.magenta('Last Name'),
            chalk.blueBright('Role'),
            chalk.yellow('Department'),  // Array for setting column names and colors
            chalk.green('Salary'),
            chalk.red('Direct Manager'),
        ],await sql.pullEmployees())
    return await pressAnyKey('Please press any key to continue\n')
}

/**
 * Prompts user through adding Department to the db
 * @returns Prompt Holder/Confirmation to Redisplay
 */
async function addDepartment() {
    const {department_name} = await inquirer.prompt({
            type: 'input',
            name: 'department_name',
            message: 'What is the new department name? '
        })
    await sql.addDepartment(department_name); // Pass determined department_name into sqlManager
    (await willRedisplay('Department')) && await viewDepartments() // If redisplaying, then display departments (d*)
    console.clear();
}

/**
 * Prompts user through adding Role to the db
 * @returns Prompt Holder/Confirmation to Redisplay
 */
async function addRole() {
    const departments = await sql.pullDepartments() // Get the Departments
    const {title, salary, department_id} = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the new role name? '
        },
        {
            type: 'number',
            name: 'salary',
            message: 'What is this role\'s salary? ',
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'What department does this role belong to? ',
            choices: () => {
                let temp = []                                                            // Function to create an array of the departments
                for (item of departments) { temp.push({value: item[0], name: item[1]}) } // choices are set with their display as the department,
                return temp;                                                             // and their passed value as the department id (1*)
            }
        }
    ])
    await sql.addRole(title, salary, department_id);  // Pass determined role information into sqlManager
    (await willRedisplay('Role')) && await viewRoles() // If redisplaying, then display roles (r*)
    console.clear();
}

/**
 * Prompts user through adding Employee to the db
 * @returns Prompt Holder/Confirmation to Redisplay
 */
async function addEmployee() {
    const roles = await sql.pullRoles() // Get the Roles
    const {first_name, last_name, role_id} = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the new employee\'s first name? '
        },
        {
            type: 'input',
            name: 'last_name',
            message: '...last name? '
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'What role does this employee have? ',
            choices: () => {
                let temp = []                                                       // Function to create an array of the roles
                for (item of roles) { temp.push({value: item[1], name: item[0]}) }  // choices are set with their display as the role,
                return temp;                                                        // and their passed value as the role id (2*)
            }
        }
    ])
    // Determine if they will have a manager assigned
    const {hasManager} = await inquirer.prompt({
        type: 'confirm',
        name: 'hasManager',
        message: 'Does this employee have a manager? '
    })
    // If they have a manager, get the list of employees and allow user to pick from them
    if (hasManager) {
        const employees = await sql.pullEmployees() // Get the Employees
        const {manager_name} = await inquirer.prompt({
            type: 'list',
            name: 'manager_name',
            message: 'Please select one of the employees below:',
            choices: () => {
                let temp = []              // Function to create an array of the employees
                for (item of employees)    // choices are set with their display as the employee name and role,
                {                          // and their passed value as just the name (3*)
                    temp.push( {name: `${item[1]} ${item[2]} ${chalk.red('| '+item[3])}`, value: `${item[1]} ${item[2]}`})
                }
                return temp;
            }
        })
        await sql.addEmployee(first_name, last_name, role_id, manager_name);  // Pass information, AND manager name in to sqlManager... or
    } else { await sql.addEmployee(first_name, last_name, role_id); }         // pass in without manager name if none exists
    (await willRedisplay('Employee')) && await viewEmployees()  // If redisplaying, then display employees (e*)
    console.clear();
}

/**
 * Prompts user through deleting Department from the db
 * @returns Prompt Holder/Confirmation to Redisplay
 */
async function delDepartment() {
    const departments = await sql.pullDepartments()
    const {department} = await inquirer.prompt({
        type: 'list',
        name: 'department',
        message: 'What department do you wish to delete? ',
        choices: () => {
            let temp = []  // Same as (1*) but passed value is a stringified object representation of the department
            for (item of departments) { temp.push({value: JSON.stringify( {'dept_id': item[0], 'department_name': item[1]} ), name: item[1]}) }
            return temp;
        }
    })
    const {dept_id, department_name} = JSON.parse(department) // Parse and destructure the department object
    //Simple confirmation of whether the user wants to delete or not
    const {willDelete} = await inquirer.prompt({
        type: 'confirm',
        name: 'willDelete',
        message: `Are you sure you wish to delete ${department_name}? ${chalk.redBright('(This is permanent)')} `
    })
    if (willDelete) {
        await sql.delDepartment(dept_id) // Pass in department id to sqlManager
    }
    (await willRedisplay('Department')) && await viewDepartments() // Same as (d*)
    console.clear();
}

/**
 * Prompts user through deleting Role from the db
 * @returns Prompt Holder/Confirmation to Redisplay
 */
async function delRole() {
    const roles = await sql.pullRoles()
    const {role} = await inquirer.prompt({
            type: 'list',
            name: 'role',
            message: 'What role does this employee have? ',
            choices: () => {
                let temp = []  // Same as (2*) but passed value is a stringified object representation of the role's name and id
                for (item of roles) { temp.push({value: JSON.stringify({'role_id': item[1], 'role_name': item[0]}), name: item[0]}) }
                return temp;
            }
    })
    const {role_id, role_name} = JSON.parse(role) // Parse and destructure the role object
    //Simple confirmation of whether the user wants to delete or not
    const {willDelete} = await inquirer.prompt({
        type: 'confirm',
        name: 'willDelete',
        message: `Are you sure you wish to delete ${role_name}? ${chalk.redBright('(This is permanent)')} `
    })
    if (willDelete) {
        await sql.delRole(role_id) // Pass in role id to sqlManager
    }
    (await willRedisplay('Role')) && await viewRoles() // Same as (r*)
    console.clear();
}

/**
 * Prompts user through deleting Employee from the db
 * @returns Prompt Holder/Confirmation to Redisplay
 */
async function delEmployee() {
    const employees = await sql.pullEmployees()
    const {employee} = await inquirer.prompt({
        type: 'list',
        name: 'employee',
        message: 'Please select one of the employees below:',
        choices: () => {
            let temp = []  // Same as (3*) but passed value is a stringified object representation of the employee's name and id
            for (item of employees) {
                temp.push( {name: `${item[1]} ${item[2]} ${chalk.red('| '+item[3])}`, value: JSON.stringify({'emp_id':item[0], 'employee_name': `${item[1]} ${item[2]}`})} )
            }
            return temp;
        }
    })
    const {emp_id, employee_name} = JSON.parse(employee) // Parse and destructure the employee object
    //Simple confirmation of whether the user wants to delete or not
    const {willDelete} = await inquirer.prompt({
        type: 'confirm',
        name: 'willDelete',
        message: `Are you sure you wish to delete ${employee_name}? ${chalk.redBright('(This is permanent)')} `
    })
    if (willDelete) {
        await sql.delEmployee(emp_id) // Pass in employee id to sqlManager
    }
    (await willRedisplay('Employee')) && await viewEmployees() // Same as (e*)
    console.clear();
}

/**
 * Prompts user through updating Employee from the db
 * Allows options to update their Role, Manager, or both
 * @returns Prompt Holder/Confirmation to Redisplay
 */
async function updateEmployee() {
    const employees = await sql.pullEmployees()
    const {employee, options} = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Please select one of the employees below:',
            choices: () => {
                let temp = []  // Same as (3*) but passed value is a stringified object representation of the employee's name, id, current manager's name, and current role name
                for (item of employees) {
                    temp.push( {name: `${item[1]} ${item[2]}`, value: JSON.stringify({'emp_id':item[0], 'employee_name': `${item[1]} ${item[2]}`, 'current_manager_name':item[6],'current_role_name':item[3]})} )
                }
                return temp;
            }
        },
        {
            type: 'checkbox',
            name: 'options',                    // Determine what options the user would like to update. Default is both
            message: 'Please select what you would like to update: ',
            choices: [{name: 'Role', value: 'changeRole', checked: true}, {name: 'Manager', value: 'changeManager', checked: true}]
        }
    ])
    const {emp_id, employee_name, current_manager_name, current_role_name} = JSON.parse(employee)  // Parse and destructure the employee object
    if (options.includes('changeRole') || options.includes('changeManager')) {
        const new_role_id = await (options.includes('changeRole') ? updateEmpRole() : updateEmpRole(current_role_name)) // Pass in role name to updateEmpRole if it was selected
        const new_manager_name = await (options.includes('changeManager') ? updateEmpManager(employees, employee_name) : current_manager_name) // Call updateEmpManager, or pass current manager name back
        await sql.updateEmployee(emp_id, new_role_id, new_manager_name)
    }
    (await willRedisplay('Employees')) && await viewEmployees()
    console.clear();
}

/**
 * Using the name passed in, gets the role_id of the given or current role
 * @param {string} current_role_name 
 * @returns role_id for role passed in
 */
async function updateEmpRole(current_role_name=null) {
    const roles = (await sql.pullRoles()).map(item => [item[0], item[1]])
    // ternary of two self executing functions... return conditional ? function : function
    // This determines what to do depending on if current_role_name has a value passed in or not
    // Either returns the current role id, or the new role id  
    return current_role_name ? (() => {
        for (item of roles) {
            if (item[0] === current_role_name) { return item[1] }
        }
    })() : (async () => {
        const {new_role} = await inquirer.prompt({
            type: 'list',
            name: 'new_role',
            message: 'What is the employee\'s new role? ',
            choices: () => { return roles.map(item => { return { name: item[0], value: item[1]} })}
        })
        return new_role
    })()
}

/**
 * Pass in array of employees from updateEmpRole, and the name of the selected employee
 * and determine from the filtered list the name of the employee being assigned as manager
 * @param {array} employees 
 * @param {string} exclude 
 * @returns Name of newly assigned manager
 */
async function updateEmpManager(employees, exclude) {
    const {new_manager} = await inquirer.prompt({
        type: 'list',
        name: 'new_manager',
        message: 'Please select one of the below to assign as the new manager:',
        choices: () => {
            let temp = []
            for (item of employees) {
                (`${item[1]} ${item[2]}` === exclude) || temp.push({name: `${item[1]} ${item[2]} ${chalk.red('| '+item[3])}`,value: `${item[1]} ${item[2]}`})
            }
            return temp;
        }
    })
    return new_manager
}

module.exports = 
{
    introHolder, menuOptions, 
    viewDepartments, viewRoles, viewEmployees, 
    addDepartment, addRole, addEmployee, 
    delDepartment, delRole, delEmployee,
    updateEmployee
}