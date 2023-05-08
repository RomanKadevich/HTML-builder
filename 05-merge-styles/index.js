const path = require('path');
const fs = require('fs');
const inputDir = path.join(__dirname, 'styles');
const outputFile = path.join(__dirname, 'project-dist', 'bundle.css');
let readStream;

fs.readdir(inputDir, { withFileTypes: true }, (err, dirents) => {
    if (err) throw err;
    const writeStream = fs.createWriteStream(outputFile);
    for (let item of dirents) {
        let inputFilePath = path.join(inputDir, item.name)
        if (!item.isDirectory() && (path.extname(inputFilePath) === '.css')) {
         readStream = fs.createReadStream(inputFilePath);
         readStream.pipe(writeStream, { end: false });
         readStream.on('end', () => {
            writeStream.write('\n');
          });
        }
      
    }
})

