const fs = require('fs')

function readSQL(filePath) {
    const statement = fs.readFile( filePath, 'utf-8', (err, data) => err ? console.error(err) : data);
    return statement
}

module.exports = {readSQL}