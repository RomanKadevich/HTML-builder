const path = require('path');
const fs = require('fs');
const dirPath = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');
function readWriteFile(filePath) {
    const targetPath = path.join(targetDir, path.basename(filePath));
    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(targetPath);
    readStream.pipe(writeStream);
    readStream.on('error', (err) => {
        if (err) throw err;
    })
}
fs.access(targetDir, (err) => {
    if (!err) {
        // папка существует, удаляем ее
        fs.rm(targetDir, { recursive: true }, (err) => {
            if (err) throw err;
            fs.mkdir(targetDir, { recursive: true }, (err) => {
                if (err) throw err;
                fs.readdir(dirPath, { withFileTypes: true }, (err, dirents) => {
                    if (err) throw err;
                    for (let item of dirents) {

                        // получение информации о файлах за исключением внутренней директории при ее наличии
                        if (!item.isDirectory()) {
                            let file = path.join(dirPath, item.name)
                            readWriteFile(file);
                        }
                    }
                })
            });
        });
    } else {
        // папка не существует, создаем ее
        fs.mkdir(targetDir, { recursive: true }, (err) => {
            if (err) throw err;
            fs.readdir(dirPath, { withFileTypes: true }, (err, dirents) => {
                if (err) throw err;
                for (let item of dirents) {

                    // получение информации о файлах за исключением внутренней директории при ее наличии
                    if (!item.isDirectory()) {
                        let file = path.join(dirPath, item.name)
                        readWriteFile(file);
                    }
                }
            })
        });
    }
});







