const fs = require('fs');

let output = "";

const CSVExport = string => output += string;

const CSVSubmit = path => {
 fs.writeFile(path, output, (err) => err ? console.error("Failed to write to file!") : 0); 
 output = "";
}

module.exports = {CSVExport, CSVSubmit} 