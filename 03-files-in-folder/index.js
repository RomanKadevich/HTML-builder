const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, "secret-folder");


function getFileInfo(filePath, name) {
    fs.stat(filePath, (err, stats) => {
        if (err) throw err;
        if (path.extname(filePath) === '') {
            console.log(`Имя отстутствует - ${name.slice(1)} - ${stats.size / 1000}kb`)
        } else {
            console.log(`${path.basename(filePath, path.extname(filePath))} - ${path.extname(filePath).slice(1)} - ${stats.size / 1000}kb`);
        }
    });
}

fs.readdir(dirPath, { withFileTypes: true }, (err, dirents) => {
    if (err) throw err;
    for (let item of dirents) {

        // получение информации о файлах за исключением внутренней директории при ее наличии
        if (!item.isDirectory()) {

            getFileInfo(path.join(dirPath, item.name), item.name);

        }

        // получение информации о файлах во внутренней директории при ее наличии
        if (item.isDirectory()) {
            let dirInDirPath = path.join(__dirname, "secret-folder", item.name);
            console.log(dirInDirPath);
            fs.readdir(dirInDirPath, { withFileTypes: true }, (err, files) => {
                if (err) throw err;
                for (let file of files) {
                    if (!file.isDirectory()) {
                        getFileInfo(path.join(dirPath, item.name, file.name), file.name)
                    }

                }
            })
        }
    }
})
