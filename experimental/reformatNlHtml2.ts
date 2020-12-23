// import * as cheerio from 'cheerio';
// import * as fs from 'fs';
// import * as sanitizeHtml from 'sanitize-html';
// import * as path from 'path';

// let nlNum = 1;

// const sanitizeNlHtml = function (newsLetterHtml: string, title: string) {
//   // load data into cheerio parser
//   const $ = cheerio.load(newsLetterHtml);
//   // by selecting this container we select just the newsletter content which is all we care about
//   const emailContent = $('td[id="EMAIL_CONTAINER"]');
//   // use sanitizeHtml npm packge to remove all inline styling except a few things
//   const sanitized = sanitizeHtml(emailContent.html(), {
//     allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
//     allowedAttributes: {
//       span: ['style'], // spans may have a style attribute
//       img: ['src'], // images may have a src attribute
//     },
//   });
//   //? (FOR DEBUGGING PURPOSES) write to file
//   fs.writeFileSync(path.join(__dirname, '..', '..', `./saniHtml/${title}.html`), sanitized);
//   nlNum++;
//   return sanitized;
// };

// export default sanitizeNlHtml;
