import * as fs from 'fs';
import * as path from 'path';
import { HydratedNl } from '../commonModels/HydratedNewsletter';
import log from '../logger';
import deliverNlEbooks from './deliverNlEbooks';
import generateEbook from './generateEbook';
import getContent from './getContent';
import recordHistoryAndFilterOldContent from './persistContentHistory';
import reformatNlHtml from './reformatNlHtml';

const today = new Date();
const dateStr = today.getMonth() + 1 + '-' + today.getDate();
const ebookDir = path.join(__dirname, '..', '..', '/generatedEBooks');

if (!fs.existsSync(ebookDir)) {
  console.log('Directory does not exist.');
  fs.mkdirSync(ebookDir);
}

const orchestrator = async function () {
  log.info('\n \n START PROCESS');
  // clear out old newsletter epubs
  log.info('removing previously generated ebooks');
  removeOldContent();

  // fetch newsletters as array of html text strings
  log.info('fetching newsletters');
  const nlContentArray: HydratedNl[] = await getContent();

  let freshNlContentArray: HydratedNl[] = [];
  //? for short circuiting the content check
  if (process.env.BYPASS_CONTENT_DEDUPE_CHECK == 'true') {
    log.info('[bypass content check] will attempt to deliver all content regardless of history');
    freshNlContentArray = nlContentArray;
  } else {
    log.info('[content check] checking hashes of previously delivered content');
    freshNlContentArray = recordHistoryAndFilterOldContent(nlContentArray);
  }

  log.info('removing font formatting for e-pub optimization');
  const cleanedNlItemArray: HydratedNl[] = [];
  for (let i = 0; i < freshNlContentArray.length; i++) {
    const nlItem = freshNlContentArray[i];
    const reformattedContent = await reformatNlHtml(nlItem.html, nlItem.title);
    const cleanedItem: HydratedNl = await Object.assign(
      /*target*/ nlItem, // html prop is overwritten
      /*source*/ { html: reformattedContent }
    );
    cleanedNlItemArray.push(cleanedItem);
  }

  log.info('generating epub zipfiles');
  // create the ePubZip
  let numToDeliver = 0;
  for (let i = 0; i < cleanedNlItemArray.length; i++) {
    numToDeliver++;
    const zipFilePath =
      process.cwd() + '/generatedEBooks/' + dateStr + '_' + cleanedNlItemArray[i].title + '.epub';
    log.info('[generating epub] ' + cleanedNlItemArray[i].title + '.epub');
    await generateEbook(cleanedNlItemArray[i], zipFilePath);
  }

  await sleep(2000); // good to pause so the filesystem has time to get caught up

  log.info('delivering eBooks to remarkable cloud');

  // await deliverNlEbooks(numToDeliver);
};

//* START ORCHESTRATION
orchestrator();

function removeOldContent() {
  const listOfNls = fs.readdirSync(ebookDir).filter((nlName) => {
    return nlName.includes('.epub');
  });
  listOfNls.forEach((nlName: string) => {
    fs.unlinkSync(path.join(ebookDir, nlName));
  });
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
