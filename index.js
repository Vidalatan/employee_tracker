require('dotenv').config();
const mysql = require('mysql2');
const cTable = require('console.table');
const chalk = require('chalk')
const promptManager = require('./utils/promptManager')
const {readSQL} = require('./utils/prepareSQL')

async function init() {
    const clear = console.clear

    const _ = await promptManager.introHolder();
    clear();
    while (true) {
        let option = await promptManager.menuOptions();
        clear();
        switch (option) {
            case 'vdep':
                promptManager.viewDepartments()
                break;
            case :
                
                break;
            case :
                
                break;
            case :
                
                break;
            case :
                
                break;
            case :
                
                break;
            case :
                
                break;
        }
    }
}

init()