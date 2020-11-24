import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import { NewsletterData } from "../commonModels/NewsletterData";
import { HydratedNl } from "../commonModels/HydratedNewsletter";

const usersLetterListString = fs
  .readFileSync(
    path.join(__dirname, "..", "..", "/userData/nlPreferences.json")
  )
  .toString();
const usersLetterListJson = <NewsletterData[]>JSON.parse(usersLetterListString);

const getContent = function (): Promise<HydratedNl[]> {
  // console.log(usersLetterListJson);
  const pendingPages = usersLetterListJson.map((nlData) => {
    return axios.get(nlData.url).then((res) => {
      return {
        displayName: nlData.displayName,
        html: res.data,
      };
    });
  });
  return Promise.all(pendingPages);
};

// ? write to file version
// const fetchedDocPath = path.join(__dirname, "..", "..", "/fetchedPages");
// usersLetterListJson.map((nlData) => {
//   axios.get(nlData.url).then((res) => {
//     fs.writeFileSync(`${fetchedDocPath}/${nlData.displayName}.html`, res.data);
//   });
// });

export default getContent;
