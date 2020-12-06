import * as fs from "fs";
import * as path from "path";
import { HydratedNl } from "../commonModels/HydratedNewsletter";
import deliverNlEbooks from "./deliverNlEbooks";
import generateEbook from "./generateEbook";
import getContent from "./getContent";
import reformatNlHtml from "./reformatNlHtml";

const today = new Date();
const dateStr = today.getMonth() + 1 + "-" + today.getDate();
const timeOfDay = today.getHours() < 12 ? "morning" : "evening";
const ebookDir = path.join(__dirname, "..", "..", "/generatedEBooks");

const orchestrator = async function () {
  // clear out old newsletter epubs
  console.log("removing previously generated ebooks");
  removeOldContent();

  // fetch newsletters as array of html text strings
  console.log("fetching newsletters");
  const nlContentArray: HydratedNl[] = await getContent(timeOfDay);

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
    const zipFilePath =
      process.cwd() +
      "/generatedEBooks/" +
      dateStr +
      "_" +
      nl.displayName +
      ".epub";
    await generateEbook(nl, zipFilePath);
  });

  await sleep(2000); // good to pause so the filesystem has time to get caught up

  console.log("delivering eBooks to remarkable cloud");

  await deliverNlEbooks();
};

//* START ORCHESTRATION
orchestrator();

function removeOldContent() {
  const listOfNls = fs.readdirSync(ebookDir).filter((nlName) => {
    return nlName.includes(".epub");
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
