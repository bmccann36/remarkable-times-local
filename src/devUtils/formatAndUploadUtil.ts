import * as Epub from 'epub-gen';
import * as fs from 'fs';
import * as path from 'path';
import { Remarkable } from 'remarkable-typescript';
import * as getUuid from 'uuid-by-string';

const deviceToken = fs.readFileSync(path.join(__dirname, '..', '..', '/userData/deviceToken.txt')).toString();

//! LOAD TEST HTML
const buffData = fs.readFileSync(path.join(__dirname, '..', '..', 'nlHtml/testInput.html'));
const rawNytHtml = buffData.toString();

const today = new Date();
const dateStr = today.getMonth() + 1 + '-' + today.getDate();

interface GenEBookInput {
  title: string;
  html: string;
}

const hydrated = {
  title: 'test',
  html: rawNytHtml,
};

const generateEbook = function (hydratedNl: GenEBookInput, fullFilePath: string) {
  /**
   * create the ebook
   */
  const ebookOptions = {
    tempDir: process.env.TEMP_DIR_PATH,
    title: hydratedNl.title,
    author: 'The New York Times',
    cover: path.join(__dirname, '..', '..', '/images/nytImage.png'), // Url or File path, both ok.
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

const testFileName = 'someTest3';

(async () => {
  await sleep(2000);
  const client = new Remarkable({
    deviceToken,
  });
  await client.refreshToken();
  const epubFileBuffer = fs.readFileSync('./testout.epub');
  console.log('UPLOADING');
  const uploadRes = await client.uploadEPUB(
    testFileName,
    getUuid(testFileName),
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
