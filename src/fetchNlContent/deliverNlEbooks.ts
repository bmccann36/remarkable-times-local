import * as fs from 'fs';
import * as path from 'path';
import { Remarkable } from 'remarkable-typescript';
import * as getUuid from 'uuid-by-string';
import log from '../logger';

const deliverNlEbooks = async function (numToDeliver: number): Promise<void> {

  const RMT_CLOUD_FOLDER_NAME = process.env.RMT_CLOUD_FOLDER_NAME ? process.env.RMT_CLOUD_FOLDER_NAME : 'Remarkable Times';

  const ebookDir = path.join(__dirname, '..', '..', '/generatedEBooks');
  const deviceToken = fs
    .readFileSync(path.join(__dirname, '..', '..', '/userData/deviceToken.txt'))
    .toString();

  const listOfNls = fs.readdirSync(ebookDir).filter((nlName) => {
    return nlName.includes('.epub');
  });
  log.info('delivering newsletters: ' + listOfNls);

  const client = new Remarkable({ deviceToken });
  await client.refreshToken();

  let numDelivered = 0;
  for (let i = 0; i < listOfNls.length; i++) {
    const nlName = listOfNls[i];
    const epubFileBuffer = fs.readFileSync(ebookDir + '/' + nlName);
    try {
      await client.uploadEPUB(
        nlName,
        getUuid(RMT_CLOUD_FOLDER_NAME + nlName),
        epubFileBuffer,
        getUuid(RMT_CLOUD_FOLDER_NAME)
      );
      numDelivered++;
    } catch (err) {
      log.error(err); // TODO this never catches (probably due to issue with epub lib)
    }
  }
  // send a warning if less were delivered than intended
  if (numDelivered < numToDeliver) {
    log.warn(`attempted to deliver ${numToDeliver} ebooks but deliverd ${numDelivered}`);
  }
  // report on the number that were delivered
  else {
    log.info(`delivered ${numDelivered} out of ${numToDeliver} newsletters to deliver`);
  }
};

export default deliverNlEbooks;
