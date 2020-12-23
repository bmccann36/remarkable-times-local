import * as fs from 'fs';
import * as path from 'path';
import axios, { AxiosResponse } from 'axios';
import { NewsletterData } from '../commonModels/NewsletterData';
import { HydratedNl } from '../commonModels/HydratedNewsletter';
import log from '../logger';
import * as chalk from 'chalk';

let usersLetterListString = '[]';
try {
  usersLetterListString = fs
    .readFileSync(path.join(__dirname, '..', '..', '/userData/nlPreferences.json'))
    .toString();
} catch (err) {
  log.info('failed to load newsletter preferences, newsletter list will be empty');
}

const usersLetterListJson = <NewsletterData[]>JSON.parse(usersLetterListString);

const getContent = function (): Promise<HydratedNl[]> {
  const pendingPages = usersLetterListJson.map((nlData) => {
    return axios.get(nlData.sampleUrl).then((res) => {
      //? for when we want to write to file for debugging
      if (process.env.WRITE_HTML_CONTENT == 'true') {
        writeFetchedNl(nlData, res);
      }
      const hydrated: HydratedNl = Object.assign(
        {
          html: res.data,
        },
        nlData
      );
      return hydrated;
    });
  });
  return Promise.all(pendingPages);
};

export default getContent;

// for debugging purposes
function writeFetchedNl(nlData: NewsletterData, res: AxiosResponse) {
  const fetchedDocPath = path.join(__dirname, '..', '..', '/fetchedPages');
  // create directory if not exists
  if (!fs.existsSync(fetchedDocPath)) {
    log.debug(`directory doesn't exist creating ${fetchedDocPath}`);
    fs.mkdirSync(fetchedDocPath);
  }
  fs.writeFileSync(`${fetchedDocPath}/${nlData.title}.html`, res.data);
}
