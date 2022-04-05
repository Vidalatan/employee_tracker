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
    return await pressAnyKey('Please press any key to start')
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

function chalkView(view) {
    console.log(chalk.green(`Displaying ${view} below:\n============================================`));
}

async function viewDepartments() {
    chalkView('Departments')
    console.table(s.pullDepartments())
    return await pressAnyKey('Please press any key to continue')
}

async function viewRoles() {
    chalkView('Roles')
    console.table(s.pullRoles())
    return await pressAnyKey('Please press any key to continue')
}

async function viewEmployees() {
    chalkView('Employees')
    console.table(s.pullEmployees())
    return await pressAnyKey('Please press any key to continue')
}

async function addDepartment() {

}

async function addRole() {

}

async function addEmployee() {

}

async function updateEmployee() {

}

module.exports = {introHolder, menuOptions, viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployee}