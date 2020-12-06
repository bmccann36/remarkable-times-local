import * as fs from "fs";
import * as path from "path";
import { Remarkable } from "remarkable-typescript";
import { v5 as uuidv5 } from "uuid";
import * as getUuid from "uuid-by-string";
import log from "../logger";

const ebookDir = path.join(__dirname, "..", "..", "/generatedEBooks");
const deviceToken = fs
  .readFileSync(path.join(__dirname, "..", "..", "/userData/deviceToken.txt"))
  .toString();

const deliverNlEbooks = async function (numToDeliver: number) {
  const listOfNls = fs.readdirSync(ebookDir).filter((nlName) => {
    return nlName.includes(".epub");
  });
  log.info("delivering newsletters: " + listOfNls);

  const client = new Remarkable({ deviceToken });
  await client.refreshToken();

  let numDelivered = 0;
  for (let i = 0; i < listOfNls.length; i++) {
    const nlName = listOfNls[i];
    const epubFileBuffer = fs.readFileSync(ebookDir + "/" + nlName);
    try {
      const uploadRes = await client.uploadEPUB(
        nlName,
        getUuid(nlName),
        epubFileBuffer,
        getUuid("Remarkable Times")
      );
      numDelivered++;
    } catch (err) {
      log.error(err);
    }
  }
  // send a warning if less were delivered than intended
  if (numDelivered < numToDeliver) {
    log.warn(
      `attempted to deliver ${numToDeliver} ebooks but deliverd ${numDelivered}`
    );
  }
  // report on the number that were delivered
  else {
    log.info(`delivered ${numDelivered} out of ${numToDeliver} newsletters to deliver`);
  }
};

export default deliverNlEbooks;
