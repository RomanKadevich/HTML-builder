const fs = require('fs');
const readline = require('readline');
const line = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const filePath = './02-write-file/text.txt';
function writeFile(data) {
  fs.appendFile(filePath, data, (err) => {
    if (err) throw err;
    console.log('Текст добавлен');
  });
}
function readText() {
  line.question('Введите текст: ', (data) => {
    if (data === 'exit' || data === 'ctrl + c') {
      line.close();
      return;
    }

    writeFile(data + '\n');
    readText();
  });
}
fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    fs.writeFile(filePath, '', (err) => {
      if (err) throw err;
      console.log('Файл создан.');
      readText();
    });
    return;
  }
  console.log('Файл существует.');
  readText();
});

const { stdin, stdout } = process;
process.on('exit', () => stdout.write('До свидания.'));