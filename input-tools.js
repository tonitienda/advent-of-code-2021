const fs = require('fs');
const path = require('path')

const getFileContent = (localpath, splitBy) => fs.readFileSync(path.join(__dirname, localpath)).toString().split(splitBy)
const getFileLines = (localpath) => getFileContent(localpath, '\r\n')

const getNumbersFromFile = (localpath, splitBy = '\r\n') => getFileContent(localpath, splitBy).map(Number)

module.exports = {
    getNumbersFromFile,
    getFileLines
}