const fs = require ('fs');
const path = require ('path');
const dirPath = path.join(__dirname, "secret-folder");
// console.log(dirPath);

function getFileInfo(filePath, name){
    fs.stat(filePath, (err, stats) => {
        if (err) throw err;
        if (path.extname(filePath) === ''){
            console.log(`Имя отстутствует - ${name} - ${stats.size / 1000}kb`)
        }else{
        console.log(`${path.basename(filePath, path.extname(filePath))} - ${path.extname(filePath)} - ${stats.size / 1000}kb`);
        // console.log(`File size: ${stats.size} bytes`);
        // console.log(`Last modified: ${stats.mtime}`);
        // console.log(`Is file: ${stats.isFile()}`);
        // console.log(`Is directory: ${stats.isDirectory()}`);
        // console.log(`Mode: ${stats.mode}\n\n`);
        }
      });
}

fs.readdir(dirPath, {withFileTypes: true}, (err, dirents) => {
    if (err) throw err;
    for (let item of dirents){
        if (!item.isDirectory()){
           
          getFileInfo(path.join(dirPath, item.name), item.name);
            

    }
        if (item.isDirectory()){
           let dirInDirPath = path.join(__dirname, "secret-folder", item.name);
           console.log(dirInDirPath);
           fs.readdir(dirInDirPath, {withFileTypes: true}, (err, files) => {
            if (err) throw err;
            for (let file of files){
                if (!file.isDirectory()){
                    getFileInfo(path.join(dirPath, item.name, file.name), file.name)
                }
              
            }
        })
        }
    }})
