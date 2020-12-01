import * as fs from "fs";
import * as cheerio from "cheerio";
import * as sanitizeHtml from "sanitize-html";

// const html = "<strong>hello world</strong>";
// console.log(sanitizeHtml(html));

const fullHtmlBuff = fs.readFileSync("./fetchedPages/Evening_Briefing.html");

const $ = cheerio.load(fullHtmlBuff.toString());
const emailContent = $('td[id="EMAIL_CONTAINER"]');
const sanitized = sanitizeHtml(emailContent.html());
//? for when you want to write to file
fs.writeFileSync("./saniNlHtml.html", sanitized);
