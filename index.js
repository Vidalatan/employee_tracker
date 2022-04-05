require('dotenv').config();
const chalk = require('chalk')
const promptManager = require('./utils/promptManager')

async function init() {
    const clear = console.clear
    const _ = await promptManager.introHolder();
    clear();
    while (true) {
        let option = await promptManager.menuOptions();
        clear();
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
                
                break;
            case 'arol':
                
                break;
            case 'aemp':
                
                break;
            case 'uemp':
                
                break;
        }
    }
}
init()