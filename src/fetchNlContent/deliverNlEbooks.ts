import { Remarkable } from "remarkable-typescript";
import * as path from "path";
import * as fs from "fs";
import { stdout } from "process";
import { v5 as uuidv5 } from "uuid";

const ebookDir = path.join(__dirname, "..", "..", "/generatedEBooks");
const deviceToken = fs
  .readFileSync(path.join(__dirname, "..", "..", "/userData/deviceToken.txt"))
  .toString();


const deliverNlEbooks = async function () {
  const listOfNls = fs.readdirSync(ebookDir).filter((nlName) => {
    return nlName.includes(".epub");
  });
  console.log(listOfNls);
  const client = new Remarkable({ deviceToken });
  await client.refreshToken();
  listOfNls.forEach(async (nlName) => {
    const epubFileBuffer = fs.readFileSync(ebookDir + "/" + nlName);
    return client.uploadEPUB(
      nlName,
      hashName(nlName),
      epubFileBuffer,
      hashName("NYT briefings")
    );
  });
};

export default deliverNlEbooks;

function hashName(inputStr) {
  return uuidv5(inputStr, "6a8bc369-8d8a-4e4c-bde7-fc9ac52fb66f");
}
