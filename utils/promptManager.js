const inquirer = require('inquirer');
const chalk = require('chalk');
const pressAnyKey = require('press-any-key');
const cTable = require('console.table');
const s = require('./sqlManager')

async function introHolder() {
    console.log(chalk.green(
        '','=========================================\n',
        '| Welcome to the Employee Tracking App! |\n',
        '=========================================\n'));
    return await pressAnyKey('Please press any key to start\n')
}

async function menuOptions() {
    const {option} = await inquirer.prompt({
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: 
        [
            {value: 'vdep', name: 'View Departments'},
            {value: 'vrol', name: 'View Roles'},
            {value: 'vemp', name: 'View Employees'},
            {value: 'adep', name: 'Add Department'},
            {value: 'arol', name: 'Add Role'},
            {value: 'aemp', name: 'Add Employee'},
            {value: 'uemp', name: 'Update Employee'}
        ]
    })
    return option
}

async function willRedisplay(newThing) {
    const {willRedisplay} = await inquirer.prompt({
        type: 'confirm',
        name: 'willRedisplay',
        message: `Do you wish to display the table containing your new ${newThing}`
    })
    return willRedisplay
}

async function viewDepartments() {
    console.table([chalk.yellow('Department ID'), chalk.yellow('Departments')], await s.pullDepartments())
    return await pressAnyKey('Please press any key to continue\n')
}

async function viewRoles() {
    console.table(
        [
            chalk.blueBright('Role'),
            chalk.blueBright('Role ID'),
            chalk.yellow('Department'),
            chalk.green('Salary'),
        ], await s.pullRoles())
    return await pressAnyKey('Please press any key to continue\n')
}

async function viewEmployees() {
    console.table(
        [
            chalk.magenta('Employee ID'),
            chalk.magenta('First Name'),
            chalk.magenta('Last Name'),
            chalk.blueBright('Role'),
            chalk.yellow('Department'),
            chalk.green('Salary'),
            chalk.red('Direct Manager'),
        ],await s.pullEmployees())
    return await pressAnyKey('Please press any key to continue\n')
}

async function addDepartment() {
    const {department_name} = await inquirer.prompt({
            type: 'input',
            name: 'department_name',
            message: 'What is the new department name? '
        })
    await s.addDepartment(department_name);
    (await willRedisplay('Department')) && await viewDepartments()
}

async function addRole() {
    const departments = await s.pullDepartments()
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
                let temp = []
                for (item of departments) { temp.push({value: item[0], name: item[1]}) }
                return temp;
            }
        }
    ])
    await s.addRole(title, salary, department_id);
    (await willRedisplay('Role')) && await viewRoles()
}

async function addEmployee() {
    const roles = await s.pullRoles()
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
                let temp = []
                for (item of roles) { temp.push({value: item[1], name: item[0]}) }
                return temp;
            }
        }
    ])
    const {hasManager} = await inquirer.prompt({
        type: 'confirm',
        name: 'hasManager',
        message: 'Does this employee have a manager? '
    })
    if (hasManager) {
        const employees = await s.pullEmployees()
        const {manager_name} = await inquirer.prompt({
            type: 'list',
            name: 'manager_name',
            message: 'Please select one of the employees below:',
            choices: () => {
                let temp = []
                for (item of employees) { temp.push(`${item[1]} ${item[2]} ${chalk.red("| "+item[3])}`) }
                return temp;
            }
        })
        await s.addEmployee(first_name, last_name, role_id, manager_name);
    } else { await s.addEmployee(first_name, last_name, role_id); }
    (await willRedisplay('Employee')) && await viewEmployees()
}

async function updateEmployee() {
    const employees = await s.pullEmployees()
    const {employee, options} = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Please select one of the employees below:',
            choices: () => {
                let temp = []
                for (item of employees) { temp.push(`${item[1]} ${item[2]}`) }
                return temp;
            }
        },
        {
            type: 'checkbox',
            name: 'options',
            message: 'Please select what you would like to update: ',
            choices: [{name: 'Role', value: 'changeRole'}, {name: 'Manager', value: 'changeManager'}]
        }
    ])
}

module.exports = {introHolder, menuOptions, viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployee}