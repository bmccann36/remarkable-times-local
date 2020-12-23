import * as cheerio from 'cheerio';

export class ContentFormatter {
  removeUnwantedStyles(fullHtml: string): string {
    const $ = cheerio.load(fullHtml);
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
        $(el).find('td').attr('style', null);
      }
      // set paragraph styles to null
      $(el).find('p').attr('style', null);
      const ulSpec = $(el).find('ul').attr('style');
      if (ulSpec) {
        $(el).find('ul').attr('style', null);
      }
    });

    const emailContent = $('td[id="EMAIL_CONTAINER"]');
    return emailContent.html();
  }
}
