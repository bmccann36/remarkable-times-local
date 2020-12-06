import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import { v5 as uuidv5 } from "uuid";
import * as getUuid from "uuid-by-string";

const html = fs
  .readFileSync(path.join(__dirname, "..", "..", "/fetchedPages/corona.html"))
  .toString();

const $ = cheerio.load(html);

const emailContent = $('td[id="EMAIL_CONTAINER"]');
console.log("corona content");
console.log(getUuid(emailContent.html()));

// ? load other newsletter
const html2 = fs
  .readFileSync(
    path.join(__dirname, "..", "..", "/fetchedPages/evening01.html")
  )
  .toString();

const $2 = cheerio.load(html2);

const eveningContent = $2('td[id="EMAIL_CONTAINER"]');

console.log("evening content");
console.log(getUuid(eveningContent.html()));

function hashName(inputStr) {
  return uuidv5(inputStr, "6a8bc369-8d8a-4e4c-bde7-fc9ac52fb66f");
}
