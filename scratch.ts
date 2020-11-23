import * as moment from 'moment';
import * as fs from "fs";
import * as path from "path";
import { Remarkable } from 'remarkable-typescript';
import * as figlet from 'figlet';
// console.log(moment().format('Z')); // get timezone

// const token = fs.readFileSync(path.join(__dirname, "./userData/deviceToken.txt")).toString();
// const client = new Remarkable({deviceToken: token});
// (async()=> {
//   await client.refreshToken();
 
//   const items = await client.getAllItems();
//   console.log(items);
// })()


console.log(figlet.textSync('Remarkable Times', {
  font: 'big',
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: 80,
  whitespaceBreak: true
}));