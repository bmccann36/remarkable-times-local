import * as prompts from "prompts";
import { Remarkable } from "remarkable-typescript";
import * as fs from "fs";
import {
  NewsletterData,
  NlNameEnum,
  NlMap,
} from "../commonModels/NewsletterData";
import { newsletterMap } from "../../static/newsletters";
import * as path from "path";
import { stdout } from "process";
import * as chalk from "chalk";
import createPlist from "./createPlist";
import * as figlet from "figlet";

const userDataDir = path.join(process.cwd(), "userData");
const oldTokenExists = checkForExistingToken();
const rmClient = new Remarkable();

(async () => {
  printBanner()
  //? CONFIGURE DEVICE TOKEN IF NOT ALREADY STORED
  const pairDevicePrompts = await prompts([
    {
      type: () => (oldTokenExists ? "confirm" : null), // determines if prompt shoudl be shown
      name: "should-overwrite-token",
      message:
        "it appears you've already authorized this app to write to your Remarkable, would you like to delete the existing credentials and generate new ones?",
    },
    {
      type: (prev) => {
        // only present this promt if a) no token exists b) user wants to overwrite the old one
        if (prev == undefined || prev == true) return "confirm";
      },
      name: "will-generate-new-token",
      message: setupTokenGeneration,
      initial: true,
    },
    {
      type: (prev) => (prev == false ? null : "text"),
      name: "prompt-code-entry",
      message: "please enter the code that was generated",
    },
  ]);
  const code = pairDevicePrompts["prompt-code-entry"];
  if (code) {
    await getAndSaveToken(code);
  }
  //? CAPTURE USER PREFERENCES
  const setPreferencesPrompts = await prompts([
    {
      type: "multiselect",
      name: "selected-newsletters",
      message: "select the newsletters you would like to recieve",
      choices: getNlDataArray(),
    },
  ]);
  // console.log('promptSection2 :>> ', nlSelection);
  const preferenceAsJson = JSON.stringify(
    setPreferencesPrompts["selected-newsletters"]
  );
  fs.writeFileSync("./userData/nlPreferences.json", preferenceAsJson);
  console.log(
    chalk.green("setting up a service on your machine to deliver newsletters")
  );
  // sets up a daemon process on user's machine
  createPlist();
  console.log(
    chalk.green(
      "your preferences have been saved \nthe newsletters you signed up for will be delivered to your remarkable every day"
    )
  );
})();

function checkForExistingToken() {
  let tokenExists = false;
  try {
    const tokenFileData = fs.statSync(userDataDir + "/deviceToken.txt");
    if (tokenFileData) {
      tokenExists = true;
    }
  } catch (ex) {
    console.log(
      chalk.green("no token detected, will prompt to create a new device token")
    );
  }
  return tokenExists;
}
function setupTokenGeneration(prev, values) {
  // delete the old token
  if (oldTokenExists) {
    fs.unlinkSync(userDataDir + "/deviceToken.txt");
  }
  return `**FIRST STEPS**
  - please login to your account at https://my.remarkable.com/
  - Once logged in, click on the link under "Desktop app" or navigate to https://my.remarkable.com/list/desktop to manage your connected apps
  - Click "Connect a new desktop" to generate a one time code
  - Once you have copied the code hit enter or type "y" to continue`;
}
async function getAndSaveToken(code: string) {
  console.log(
    chalk.green("using code to register remarkable-times with your device...")
  );

  const deviceToken = await rmClient.register({ code: code });
  // ? write token to userData directory
  fs.writeFileSync("./userData/deviceToken.txt", deviceToken);
}
function getNlDataArray() {
  //? display the list of possible newsletters a user can get
  const names = Object.values(NlNameEnum);
  const choices = names.map((name: string) => {
    return {
      title: newsletterMap[name].displayName,
      value: newsletterMap[name],
    };
  });
  return choices;
}

function printBanner() {
  const banner = figlet.textSync("Remarkable Times", {
    font: "big",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  });
  console.log(banner);
}
