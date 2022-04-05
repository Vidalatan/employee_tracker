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

async function viewDepartments() {
    console.table([chalk.green('Departments')], await s.pullDepartments())
    return await pressAnyKey('Please press any key to continue\n')
}

async function viewRoles() {
    console.table(await s.pullRoles())
    return await pressAnyKey('Please press any key to continue\n')
}

async function viewEmployees() {
    console.table(await s.pullEmployees())
    return await pressAnyKey('Please press any key to continue\n')
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