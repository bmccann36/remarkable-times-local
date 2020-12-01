import * as path from 'path';
const fs = require("fs").promises;

const directory = "./generatedEbooks";

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    console.log(file);
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
    });
  }
});