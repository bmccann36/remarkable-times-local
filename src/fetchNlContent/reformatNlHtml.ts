import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

const reformatNlHtml = function (newsLetterHtml: string, title?: string) {
  // load data into cheerio parser
  const $ = cheerio.load(newsLetterHtml);

  // remove div styling
  $('div').each(function (i, el) {
    $(el).attr('style', null);
  });

  /**
   * iterates over each tbody element and removes the styling of child elements within the tbody
   */
  $('tbody').each(function (i, el) {
    // select any "span" element that is inside a tbody element
    $(el).find('span').attr('style', null);

    const tdStyle = $(el).find('td').attr('style');
    // remove font size
    if (tdStyle) {
      const newTdStyle = removeFontStyles(tdStyle);
      $(el).find('td').attr('style', newTdStyle);
    }
    // set paragraph styles to null
    $(el).find('p').attr('style', null);
    const ulSpec = $(el).find('ul').attr('style');
    if (ulSpec) {
      const newUlSpec = removeFontStyles(ulSpec);
      $(el).find('ul').attr('style', newUlSpec);
    }
  });

  const emailContent = $('td[id="EMAIL_CONTAINER"]');
  //? for when you want to write to file
  fs.writeFileSync(path.join(__dirname, '..', '..', `nlHtml/${title}.html`), emailContent.html());
  return emailContent.html();
};

export default reformatNlHtml;

//? testing
// const buffData = fs.readFileSync(path.join(__dirname, "..", "..", "fetchedPages/Morning Briefing.html"))
// const morningBriefingString = buffData.toString();
// reformatNlHtml(morningBriefingString)

/**
 *
 * @param styleAttributes string of inline style attributes
 * @returns { filteredStyleAttributes } same style attributes but with any font style removed
 */
function removeFontStyles(styleAttributes: string): string {
  const attrList = styleAttributes.split(';');
  const filtered = attrList.filter((cssProp) => {
    return cssProp.includes('font') == false;
  });
  return filtered.join();
}
