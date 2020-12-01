import { HydratedNl } from "../commonModels/HydratedNewsletter";
import deliverNlEbooks from './deliverNlEbooks';
import generateEbook from "./generateEbook";
import getContent from "./getContent";
import reformatNlHtml from "./reformatNlHtml";

const today = new Date();
const dateStr = today.getMonth() + 1 + "-" + today.getDate();

const orchestrator = async function () {
  // fetch newsletters as array of html text strings
  console.log("fetching newsletters");
  const nlContentArray: HydratedNl[] = await getContent();

  console.log("removing font formatting for e-pub optimization");
  const cleanedNlItemArray: HydratedNl[] = nlContentArray.map((item) => {
    return {
      displayName: item.displayName,
      html: reformatNlHtml(item.html),
    };
  });

  console.log("generating epub zipfiles");
  // create the ePubZip
  cleanedNlItemArray.forEach(async (nl: HydratedNl) => {
    const zipFilePath = process.cwd() + "/generatedEBooks/" + dateStr + "_" + nl.displayName + ".epub";
    await generateEbook(nl, zipFilePath);
  });

  await sleep(2000) // good to pause so the filesystem has time to get caught up

  console.log("delivering eBooks to remarkable cloud");

  await deliverNlEbooks()
};

orchestrator()

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
