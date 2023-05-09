const path = require('path');
const fs = require('fs');
const dirPath = path.join(__dirname, 'assets');
const targetDir = path.join(__dirname, 'project-dist', 'assets');
const inputDirCSS = path.join(__dirname, 'styles');
const outputFileCSS = path.join(__dirname, 'project-dist', 'style.css');
let readStreamCSS;
let readStreamHTML;
const componentsFilePath = path.join(__dirname, 'components');
const htmlFilePath = path.join(__dirname, 'project-dist', 'index.html');
const templHtmlFilePath = path.join(__dirname, 'template.html');

function readWriteFile(filePath) {
    const relativePath = path.relative(dirPath, filePath);
    const targetPath = path.join(targetDir, relativePath);
    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(targetPath);
    readStream.pipe(writeStream);
    readStream.on('error', (err) => {
        if (err) throw err;
    })
}


function htmlBulder(inputDir, outputDir) {
    fs.mkdir(outputDir, { recursive: true }, (err) => {
        if (err) throw err;
        fs.readdir(inputDir, { withFileTypes: true }, (err, dirents) => {
            if (err) throw err;
            for (let item of dirents) {
                if (item.isDirectory()) {
                    htmlBulder(
                        path.join(inputDir, item.name),
                        path.join(outputDir, item.name)
                    );
                } else {
                    readWriteFile(path.join(inputDir, item.name));
                }
            }
            fs.readdir(inputDirCSS, { withFileTypes: true }, (err, dirents) => {
                if (err) throw err;

                const writeStream = fs.createWriteStream(outputFileCSS);
                // для каждого файла создаем поток чтения и записываем все файлы в один файл для записи
                for (let item of dirents) {
                    let inputFilePath = path.join(inputDirCSS, item.name)
                    // проверяем, что файл не директория и имеет расширение стилей
                    if (!item.isDirectory() && (path.extname(inputFilePath) === '.css')) {
                        readStreamCSS = fs.createReadStream(inputFilePath);
                        readStreamCSS.pipe(writeStream, { end: false });
                        //  после записи файла делаем перенос, чтобы файлы не сливались
                        readStreamCSS.on('end', () => {
                            writeStream.write('\n');
                        });
                    }

                }
            })

            fs.copyFile(templHtmlFilePath, htmlFilePath, (err) => {
                if (err) throw err;
                fs.access(path.join(__dirname, 'project-dist', 'template.html'), (err) => {
                    if (!err) {
                        fs.rename(path.join(__dirname, 'project-dist', 'template.html'), htmlFilePath, (err) => {
                            if (err) throw err;
                        })
                    }
                })
            })


            fs.access(path.join(__dirname, 'project-dist'), (err) => {
                if (!err) {
                    fs.readFile(htmlFilePath, 'utf8', (err, data) => {
                        if (err) throw err;

                        const componentsData = {};

                        // Проверяем, что директория с компонентами существует и содержит файлы
                        fs.stat(componentsFilePath, (err, stats) => {
                            if (err || !stats.isDirectory()) {
                                if (err) throw err;
                            }

                            fs.readdir(componentsFilePath, { withFileTypes: true }, (err, dirents) => {
                                if (err) throw err;

                                // Обрабатываем каждый компонент bи считываем содержимое компонента и сохраняем в объекте
                                for (let dirent of dirents) {
                                    if (!dirent.isDirectory()) {
                                        const componentName = path.parse(dirent.name).name;

                                        // 
                                        fs.readFile(path.join(componentsFilePath, dirent.name), 'utf8', (err, componentData) => {
                                            if (err) throw err;
                                            componentsData[componentName] = componentData;

                                            // Если прочитали все компоненты, производим замену шаблонных тегов и сохраняем результат
                                            if (Object.keys(componentsData).length === dirents.filter(dirent => !dirent.isDirectory()).length) {
                                                const resultData = data.replace(/{{([^}]+)}}/g, (match, tag) => {
                                                    return componentsData[tag] || match;
                                                });
                                                fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), resultData, (err) => {
                                                    if (err) throw err;
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        });
                    })
                }
            })

        })
    });
}
// копируем папку assets в директории project-dist
htmlBulder(dirPath, targetDir);
