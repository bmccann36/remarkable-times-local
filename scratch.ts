import * as moment from 'moment';
import * as fs from "fs";
import * as path from "path";
import { Remarkable } from 'remarkable-typescript';
// console.log(moment().format('Z')); // get timezone

const token = fs.readFileSync(path.join(__dirname, "./userData/deviceToken.txt")).toString();
const client = new Remarkable({deviceToken: token});
(async()=> {
  await client.refreshToken();
 
  const items = await client.getAllItems();
  console.log(items);
})()
