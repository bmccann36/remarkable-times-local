import { HydratedNl } from '../commonModels/HydratedNewsletter';
import log from '../logger';
import * as getUuid from 'uuid-by-string';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

/*
! DIFFERENT SCENARIOS
- //?key exists
  - but content is different => add to list of nls to fetch, then update the dict
  - content is the same => don't add nl to queue of nls to fetch, don't change the dict
- //?key does not exist
*/

function recordHistoryAndFilterOldContent(nlContentArray: HydratedNl[]): HydratedNl[] {
  let contentHistoryTable = {};
  // check if file exists
  const contentHistFilePath = path.join(__dirname, '..', '..', 'userData/contentHistory.json');
  if (fs.existsSync(contentHistFilePath)) {
    log.info('loading history file');
    contentHistoryTable = JSON.parse(fs.readFileSync(contentHistFilePath).toString());
  } else {
    log.info('upload history file does not exist will create');
  }
  // make a new copy that we'll modify and write as new
  const newHistTable = Object.assign({}, contentHistoryTable);

  const newContentArray: HydratedNl[] = [];

  nlContentArray.forEach((nlData: HydratedNl) => {
    // GRAB ONE TEST PIECE
    const html = nlData.html;
    const $ = cheerio.load(html);
    const emailContent = $('td[id="EMAIL_CONTAINER"]');
    const fetchedNlHash = getUuid(emailContent.html());
    // if key exists compare hashes
    if (contentHistoryTable[nlData.newsletterId]) {
      const prevContentHash = contentHistoryTable[nlData.newsletterId];
      const hashesAreSame: boolean = prevContentHash == fetchedNlHash;
      log.debug('compare content', { title: nlData.title, hashesAreSame });
      //? if the key exists and the hashes are different that means there is new content
      if (!hashesAreSame) {
        log.info('new content detected for [', nlData.title, '] will add to array');
        newContentArray.push(nlData);
        newHistTable[nlData.newsletterId] = fetchedNlHash;
      }
    }
    //? if key does not exist add the new key AND add content
    if (!contentHistoryTable[nlData.newsletterId]) {
      log.info(
        'key does not exist in history for NL [',
        nlData.title,
        '] content will be sent and entry added to to history'
      );
      // add to history table which will be persisted
      contentHistoryTable[nlData.newsletterId] = fetchedNlHash;
      // add to list of nls to deliver
      newContentArray.push(nlData);
      newHistTable[nlData.newsletterId] = fetchedNlHash;
    }
  });
  const newContentList = newContentArray.map((hydrated) => hydrated.title);
  log.info('new content: ', newContentList);
  // write file with latest content history
  fs.writeFileSync(contentHistFilePath, JSON.stringify(newHistTable, null, 2));
  return newContentArray;
}

export default recordHistoryAndFilterOldContent;
