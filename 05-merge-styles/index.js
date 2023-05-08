const path = require('path');
const fs = require('fs');
const inputDir = path.join(__dirname, 'styles');
const outputFile = path.join(__dirname, 'project-dist', 'bundle.css');
let readStream;

fs.readdir(inputDir, { withFileTypes: true }, (err, dirents) => {
    if (err) throw err;

    const writeStream = fs.createWriteStream(outputFile);
    // для каждого файла создаем поток чтения и записываем все файлы в один файл для записи
    for (let item of dirents) {
        let inputFilePath = path.join(inputDir, item.name)
        // проверяем, что файл не директория и имеет расширение стилей
        if (!item.isDirectory() && (path.extname(inputFilePath) === '.css')) {
            readStream = fs.createReadStream(inputFilePath);
            readStream.pipe(writeStream, { end: false });
            //  после записи файла делаем перенос, чтобы файлы не сливались
            readStream.on('end', () => {
                writeStream.write('\n');
            });
        }

    }
})

