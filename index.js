require('dotenv').config();
const promptManager = require('./utils/promptManager')

// Initialization function that acts as an initial handler
async function init() {
    const _ = await promptManager.introHolder();  // Prints banner and holds user
    while (true) {
        // Prompt options and then switch to specific promp sequence
        let option = await promptManager.menuOptions();
        console.clear()
        switch (option) {
            case 'vdep':
                await promptManager.viewDepartments();
                break;
            case 'vrol':
                await promptManager.viewRoles();
                break;
            case 'vemp':
                await promptManager.viewEmployees()
                break;
            case 'adep':
                await promptManager.addDepartment()
                break;
            case 'arol':
                await promptManager.addRole()
                break;
            case 'aemp':
                await promptManager.addEmployee()
                break;
            case 'ddep':
                await promptManager.delDepartment()
                break;
            case 'drol':
                await promptManager.delRole()
                break;
            case 'demp':
                await promptManager.delEmployee()
                break;
            case 'uemp':
                await promptManager.updateEmployee()
                break;
        }
    }
}
init()  // Start the application