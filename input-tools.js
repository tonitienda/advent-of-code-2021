const fs = require('fs');
const path = require('path')

const getNumbersFromFile = (localpath) => fs.readFileSync(path.join(__dirname, localpath)).toString().split('\n').map(Number)

module.exports = {
    getNumbersFromFile
}