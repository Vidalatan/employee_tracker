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
    (await willRedisplay('Department')) ? await viewDepartments() : await pressAnyKey('Please press any key to continue\n')
}

async function addRole() {

}

async function addEmployee() {

}

async function updateEmployee() {

}

module.exports = {introHolder, menuOptions, viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployee}