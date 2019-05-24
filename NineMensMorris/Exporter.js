const fs = require('fs');

let output = "";

const CSVExport = string => output += string;

const CSVSubmit = string => fs.writeFile("exported-winners-2.csv", output, (err) => err ? console.error("Failed to write to file!") : 0); 

module.exports = {CSVExport, CSVSubmit} 