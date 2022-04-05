const inquirer = require('inquirer');
const chalk = require('chalk');
const pressAnyKey = require('press-any-key');
const cTable = require('console.table');
const sql = require('./sqlManager')

async function introHolder() {
    console.log(chalk.green(
        '','=========================================\n',
        '| Welcome to the Employee Tracking App! |\n',
        '=========================================\n'));
    return await pressAnyKey('      Please press any key to start\n(Or \'ctrl+c\' to exit the app at any time)')
}

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

async function willRedisplay(newThing) {
    const {willRedisplay} = await inquirer.prompt({
        type: 'confirm',
        name: 'willRedisplay',
        message: `Do you wish to display the table containing your new ${newThing}`
    })
    return willRedisplay
}

async function viewDepartments() {
    console.table([chalk.yellow('Department ID'), chalk.yellow('Departments')], await sql.pullDepartments())
    return await pressAnyKey('Please press any key to continue\n')
}

async function viewRoles() {
    console.table(
        [
            chalk.blueBright('Role'),
            chalk.blueBright('Role ID'),
            chalk.yellow('Department'),
            chalk.green('Salary'),
        ], await sql.pullRoles())
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
        ],await sql.pullEmployees())
    return await pressAnyKey('Please press any key to continue\n')
}

async function addDepartment() {
    const {department_name} = await inquirer.prompt({
            type: 'input',
            name: 'department_name',
            message: 'What is the new department name? '
        })
    await sql.addDepartment(department_name);
    (await willRedisplay('Department')) && await viewDepartments()
    console.clear();
}

async function addRole() {
    const departments = await sql.pullDepartments()
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
    await sql.addRole(title, salary, department_id);
    (await willRedisplay('Role')) && await viewRoles()
    console.clear();
}

async function addEmployee() {
    const roles = await sql.pullRoles()
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
        const employees = await sql.pullEmployees()
        const {manager_name} = await inquirer.prompt({
            type: 'list',
            name: 'manager_name',
            message: 'Please select one of the employees below:',
            choices: () => {
                let temp = []
                for (item of employees) { temp.push( {name: `${item[1]} ${item[2]} ${chalk.red('| '+item[3])}`, value: `${item[1]} ${item[2]}`}) }
                return temp;
            }
        })
        await sql.addEmployee(first_name, last_name, role_id, manager_name);
    } else { await sql.addEmployee(first_name, last_name, role_id); }
    (await willRedisplay('Employee')) && await viewEmployees()
    console.clear();
}

async function delDepartment() {
    
}

async function delRole() {

}

async function delEmployee() {
    const employees = await sql.pullEmployees()
    const {employee} = await inquirer.prompt({
        type: 'list',
        name: 'employee',
        message: 'Please select one of the employees below:',
        choices: () => {
            let temp = []
            for (item of employees) {
                temp.push( {name: `${item[1]} ${item[2]} ${chalk.red('| '+item[3])}`, value: JSON.stringify({'emp_id':item[0], 'employee_name': `${item[1]} ${item[2]}`})} )
            }
            return temp;
        }
    })
    const {emp_id, employee_name} = JSON.parse(employee)
    const {willDelete} = await inquirer.prompt({
        type: 'confirm',
        name: 'willDelete',
        message: `Are you sure you wish to delete ${employee_name}? (This is permanent) `
    })
    if (willDelete) {
        await sql.delEmployee(emp_id)
    }
    (await willRedisplay('Employee')) && await viewEmployees()
    console.clear();
}

async function updateEmployee() {
    const employees = await sql.pullEmployees()
    const {employee, options} = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Please select one of the employees below:',
            choices: () => {
                let temp = []
                for (item of employees) {
                    temp.push( {name: `${item[1]} ${item[2]}`, value: JSON.stringify({'emp_id':item[0], 'employee_name': `${item[1]} ${item[2]}`, 'current_manager_name':item[6],'current_role_name':item[3]})} )
                }
                return temp;
            }
        },
        {
            type: 'checkbox',
            name: 'options',
            message: 'Please select what you would like to update: ',
            choices: [{name: 'Role', value: 'changeRole', checked: true}, {name: 'Manager', value: 'changeManager', checked: true}]
        }
    ])
    const {emp_id, employee_name, current_manager_name, current_role_name} = JSON.parse(employee)
    if (options.includes('changeRole') || options.includes('changeManager')) {
        const new_role_id = await (options.includes('changeRole') ? updateEmpRole() : updateEmpRole(current_role_name))
        const new_manager_name = await (options.includes('changeManager') ? updateEmpManager(employees, employee_name) : current_manager_name)
        await sql.updateEmployee(emp_id, new_role_id, new_manager_name)
    }
    (await willRedisplay('Employees')) && await viewEmployees()
    console.clear();
}

async function updateEmpRole(current_role_name=null) {
    const roles = (await sql.pullRoles()).map(item => [item[0], item[1]])
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