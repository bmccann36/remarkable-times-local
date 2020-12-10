import * as Epub from 'epub-gen';
import * as path from 'path';
import * as fs from 'fs';
import { HydratedNl } from '../commonModels/HydratedNewsletter';
import { Remarkable } from 'remarkable-typescript';
import * as getUuid from 'uuid-by-string';
import reformatNlHtml from '../fetchNlContent/reformatNlHtml';

//! LOAD TEST HTML
const buffData = fs.readFileSync(path.join(__dirname, '..', 'nlHtml/testfile.html'));
const morningBriefingString = buffData.toString();

// /Users/chylomicronman/git-repos/rtv2/nlHtml/Coronavrius Briefing.html

//! REMOVE STYLING
const unStyledStr = reformatNlHtml(morningBriefingString, 'test_OUT');

const today = new Date();
const dateStr = today.getMonth() + 1 + '-' + today.getDate();

const hydrated = {
  title: 'test',
  html: unStyledStr,
};

const generateEbook = function (hydratedNl: any, fullFilePath: string) {
  /**
   * create the ebook
   */
  const ebookOptions = {
    tempDir: process.env.TEMP_DIR_PATH,
    title: hydratedNl.title,
    author: 'The New York Times',
    cover: path.join(__dirname, '..', '/images/nytImage.png'), // Url or File path, both ok.
    content: [
      {
        title: hydratedNl.title,
        data: hydratedNl.html,
      },
    ],
  };
  /**
   * write the epub to file
   */
  new Epub(ebookOptions, fullFilePath);
};

generateEbook(hydrated, './testout.epub');

(async () => {
  await sleep(2000);
  const client = new Remarkable({
    deviceToken:
      'LOAD THE TOKEN',
  });
  await client.refreshToken();
  const epubFileBuffer = fs.readFileSync('./testout.epub');
  console.log('UPLOADING');
  const uploadRes = await client.uploadEPUB(
    'corona',
    getUuid('corona'),
    epubFileBuffer,
    getUuid('Remarkable Times')
  );
  console.log(uploadRes);
})();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
