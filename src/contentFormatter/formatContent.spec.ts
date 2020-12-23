import * as cheerio from 'cheerio';
import { ContentFormatter } from './formatContent';
import { html, TemplateResult } from 'lit-html';
import * as fs from 'fs';
import * as path from 'path';

const sampleHtml = fs.readFileSync(path.join(__dirname, './sampleInput.html')).toString();

describe('ContentFormatter', () => {
  let target: ContentFormatter;
  beforeEach(() => {
    target = new ContentFormatter();
  });
  it('does a thing', () => {
    const newHtml = target.removeUnwantedStyles(sampleHtml);
    fs.writeFileSync('./cleaned.html', newHtml);
  });
});

function getPargraphContent(): string {
  const template: TemplateResult = html`
    <div style="margin: 0 auto; max-width: 600px; width: 100%">
      <table width="100%" cellpadding="0">
        <tbody>
          <tr>
            <td align="left">
              <p style="color: #333; font: normal 17px/25px georgia, serif; margin: 0 0 15px">
                President Trump&#x2019;s attempts to overturn the election result are very unlikely to
                succeed. For that reason, the effort can sometimes seem like a publicity stunt &#x2014; an
                effort by Trump to raise money and burnish his image with his supporters.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
  return template.getHTML();
}
