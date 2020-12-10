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
const timeOfDay = today.getHours() < 12 ? 'morning' : 'evening';
const ebookDir = path.join(__dirname, '..', '..', '/generatedEBooks');

const orchestrator = async function () {
  log.info('\n \n START PROCESS')
  // clear out old newsletter epubs
  log.info('removing previously generated ebooks');
  removeOldContent();

  // fetch newsletters as array of html text strings
  log.info('fetching newsletters');
  const nlContentArray: HydratedNl[] = await getContent(timeOfDay);

  const freshNlContentArray = recordHistoryAndFilterOldContent(nlContentArray);

  log.info('removing font formatting for e-pub optimization');
  const cleanedNlItemArray: HydratedNl[] = freshNlContentArray.map((item) => {
    return Object.assign(
      {
        html: reformatNlHtml(item.html, item.title),
      },
      item
    );
  });

  log.info('generating epub zipfiles');
  // create the ePubZip
  let numToDeliver = 0;
  cleanedNlItemArray.forEach(async (nl: HydratedNl) => {
    numToDeliver++;
    const zipFilePath = process.cwd() + '/generatedEBooks/' + dateStr + '_' + nl.title + '.epub';
    await generateEbook(nl, zipFilePath);
  });

  await sleep(2000); // good to pause so the filesystem has time to get caught up

  log.info("delivering eBooks to remarkable cloud");

  await deliverNlEbooks(numToDeliver);
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
