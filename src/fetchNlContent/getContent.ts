import * as fs from "fs";
import * as path from "path";
import axios, { AxiosResponse } from "axios";
import { NewsletterData } from "../commonModels/NewsletterData";
import { HydratedNl } from "../commonModels/HydratedNewsletter";
import log from "../logger";

const usersLetterListString = fs
  .readFileSync(
    path.join(__dirname, "..", "..", "/userData/nlPreferences.json")
  )
  .toString();
const usersLetterListJson = <NewsletterData[]>JSON.parse(usersLetterListString);

const getContent = function (timeOfDay: string): Promise<HydratedNl[]> {
  log.info(`[filter newsletters] will only deliver ${timeOfDay} newsletters`);
  const lettersToFetch: NewsletterData[] = usersLetterListJson.filter(
    (nlData: NewsletterData) => {
      return nlData.deliveryInfo.timeOfDay == timeOfDay;
    }
  );

  const pendingPages = lettersToFetch.map((nlData) => {
    return axios.get(nlData.sampleUrl).then((res) => {
      //? for when we want to write to file for debugging
      // writeFetchedNl(nlData, res);
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

function writeFetchedNl(nlData: NewsletterData, res: AxiosResponse) {
  const fetchedDocPath = path.join(__dirname, "..", "..", "/fetchedPages");

  fs.writeFileSync(`${fetchedDocPath}/${nlData.title}.html`, res.data);
}
