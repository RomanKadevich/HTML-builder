const path = require('path');
const fs = require('fs');
const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);
console.log(filePath)
const readStream = fs.createReadStream(filePath, {encoding: 'utf8'});
readStream.on('data', (partOfData) => {
    console.log(partOfData);
})
readStream.on('error', (err) => {
    if (err) throw err;
})
