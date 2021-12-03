const fs = require('fs');
const path = require('path')

const getFileLines = (localpath) => fs.readFileSync(path.join(__dirname, localpath)).toString().split('\r\n')

const getNumbersFromFile = (localpath) => getFileLines(localpath).map(Number)

module.exports = {
    getNumbersFromFile,
    getFileLines
}