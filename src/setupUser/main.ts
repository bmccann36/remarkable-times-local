import * as prompts from "prompts";
import { Remarkable } from "remarkable-typescript";
import * as fs from "fs";
import {
  NewsletterData,
  NlNameEnum,
  NlMap,
} from "../commonModels/NewsletterData";
import { newsletterMap } from "../../static/newsletters";

captureToken()
.then(() => capturePreferences());
// capturePreferences()

async function captureToken() {
  const rmClient = new Remarkable();


  const response = await prompts([
    {
      type: "confirm",
      name: "value",
      message:
        `- please login to your account at https://my.remarkable.com/ 
         - Once logged in, click on the link under "Browser extension" to manage your connected apps
         - Once you have the code hit enter or type "y" to continue`,
      initial: true,
    },
    {
      type: "text",
      name: "pairingCode",
      message: "enter the code",
    },
  ]);
  // const deviceToken = await rmClient.register({ code: "bdnfmdzb" }); //! not doing for now
  console.log("response :>> ", response);
  console.log("simulating a token fetch");
  await sleep(1000);
  const fakeToken = "abcdefsFAKE-TOKEN";

  // ? write token to userData directory
  fs.writeFileSync("./userData/deviceToken.txt", fakeToken);
}

async function capturePreferences() {
  //? display the list of possible newsletters a user can get
  const names = Object.values(NlNameEnum);
  const choices = names.map((name: string) => {
    return {
      title: newsletterMap[name].displayName,
      value: newsletterMap[name],
    };
  });

  const nlSelection = await prompts([
    {
      type: "multiselect",
      name: "selectedNewsletters",
      message: "select the newsletters you would like to recieve",
      choices: choices,
    },
  ]);
  // console.log('promptSection2 :>> ', nlSelection);
  const preferenceAsJson = JSON.stringify(nlSelection.selectedNewsletters);
  fs.writeFileSync("./userData/nlPreferences.json", preferenceAsJson)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
