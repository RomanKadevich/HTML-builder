const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, "secret-folder");


function getFileInfo(filePath) {
    fs.stat(filePath, (err, stats) => {
        if (err) throw err;
        console.log(`${path.basename(filePath, path.extname(filePath))} - ${path.extname(filePath).slice(1)} - ${stats.size / 1000}kb`);

    });
}

fs.readdir(dirPath, { withFileTypes: true }, (err, dirents) => {
    if (err) throw err;
    for (let item of dirents) {

        // получение информации о файлах за исключением внутренней директории при ее наличии
        if (!item.isDirectory()) {

            getFileInfo(path.join(dirPath, item.name));

        }

    }
})
