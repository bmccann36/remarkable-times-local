import * as chalk from 'chalk';
import * as figlet from 'figlet';
import * as fs from 'fs';
import * as path from 'path';
import * as prompts from 'prompts';
import { ItemResponse, Remarkable } from 'remarkable-typescript';
import * as getUuid from 'uuid-by-string';
import { NewsletterData } from '../commonModels/NewsletterData';
import log from '../logger';
import createPlist from './createPlist';
import { filteredNls } from './filterNewsletters';

let oldTokenExists = false;
const userDataDir = path.join(__dirname, '..', '..', 'userData');
const client = new Remarkable();

export async function setupUser(): Promise<void> {
  // setup userData directory if it does not exist
  if (!fs.existsSync(userDataDir)) {
    console.log('userDataDir does not exist. will create at: ', userDataDir);
    fs.mkdirSync(userDataDir);
  }

  oldTokenExists = checkForExistingToken(userDataDir);

  printBanner();
  //? CONFIGURE DEVICE TOKEN IF NOT ALREADY STORED
  const pairDevicePrompts = await prompts([
    {
      type: () => (oldTokenExists ? 'confirm' : null), // determines if prompt shoudl be shown
      name: 'should-overwrite-token',
      message:
        "it appears you've already authorized this app to write to your Remarkable, would you like to delete the existing credentials and generate new ones?",
    },
    {
      type: (prev) => {
        // only present this promt if a) no token exists b) user wants to overwrite the old one
        if (prev == undefined || prev == true) return 'confirm';
      },
      name: 'will-generate-new-token',
      message: setupTokenGeneration,
      initial: true,
    },
    {
      type: (prev) => (prev == false ? null : 'text'),
      name: 'prompt-code-entry',
      message: 'please enter the code that was generated',
    },
  ]);
  const code = pairDevicePrompts['prompt-code-entry'];
  if (code) {
    await getAndSaveToken(code);
  }
  //? CAPTURE USER PREFERENCES
  const setPreferencesPrompts = await prompts([
    {
      type: 'multiselect',
      name: 'selected-newsletters',
      message:
        'select the newsletters you would like to recieve, \n you can review samples here \u001b[34mhttps://www.nytimes.com/newsletters',
      choices: getNlDataArray(),
    },
  ]);
  const preferenceAsJson = JSON.stringify(setPreferencesPrompts['selected-newsletters'], null, 2);
  fs.writeFileSync(`${userDataDir}/nlPreferences.json`, preferenceAsJson);
  console.log(chalk.green('setting up a service on your machine to deliver newsletters'));
  await createRemarkableDirectory();
  // sets up a daemon process on user's machine
  createPlist();
  console.log(
    chalk.green(
      'your preferences have been saved \nthe newsletters you signed up for will be delivered to your remarkable every day'
    )
  );
}

export async function createRemarkableDirectory(): Promise<void> {
  const deviceToken = fs.readFileSync(`${userDataDir}/deviceToken.txt`).toString();
  const client = new Remarkable({ deviceToken });
  await client.refreshToken();
  const rtFolder: ItemResponse = await client.getItemWithId(getUuid('Remarkable Times'));
  if (rtFolder.Success) {
    console.log(
      chalk.yellow('Remarkable Times folder already exists on your Remarkable device, skipping creation')
    );
  } else {
    console.log(chalk.yellow('no Remarkable Times folder exists, will create'));
    const dirCreateRes = await client.createDirectory('Remarkable Times', getUuid('Remarkable Times'));
    console.log(chalk.yellow('directory created with ID: ', dirCreateRes));
  }
}

function checkForExistingToken(userDataDir: string) {
  let tokenExists = false;
  try {
    const tokenFileData = fs.statSync(userDataDir + '/deviceToken.txt');
    if (tokenFileData) {
      tokenExists = true;
    }
  } catch (ex) {
    console.log(chalk.green('no token detected, will prompt to create a new device token'));
  }
  return tokenExists;
}
function setupTokenGeneration(prev, values) {
  // delete the old token
  if (oldTokenExists) {
    fs.unlinkSync(userDataDir + '/deviceToken.txt');
  }
  return `**FIRST STEPS**
  - please login to your account at https://my.remarkable.com/
  - Once logged in, click on the link under "Desktop app" or navigate to https://my.remarkable.com/list/desktop to manage your connected apps
  - Click "Connect a new desktop" to generate a one time code
  - Once you have copied the code hit enter or type "y" to continue`;
}
async function getAndSaveToken(code: string) {
  console.log(
    chalk.green('using code to register remarkable-times with your device. This will take a few seconds....')
  );

  const deviceToken = await client.register({ code: code });
  // ? write token to userData directory
  fs.writeFileSync(`${userDataDir}/deviceToken.txt`, deviceToken);
}
function getNlDataArray() {
  //? display the list of possible newsletters a user can get

  const choices = filteredNls.map((nlData: NewsletterData) => {
    return {
      title: nlData.title,
      value: nlData,
    };
  });
  return choices;
}

function printBanner() {
  const banner = figlet.textSync('Remarkable Times', {
    font: 'big',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true,
  });
  console.log(banner);
}
