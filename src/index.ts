#!/usr/bin/env node
import * as dotenv from 'dotenv';
import * as path from 'path';

if (process.env.NODE_ENV == 'dev') {
  console.log('USING DEV CONFIG');
  dotenv.config({ path: path.join(__dirname, '..', 'dev.env') });
} else {
  dotenv.config();
  process.env.LOG_OVERWRITE = 'false';
  process.env.LOG_ATTACH_TRANSPORT = 'false';
}
import * as chalk from 'chalk';
import { setupUser } from './setupUser/main';
let orchestrator;
try {
  /*eslint-disable*/ orchestrator = require('./main').orchestrator; /*eslint-enable*/
} catch (err) {
  console.log('orchestrator not imported');
}
import * as fs from 'fs';

const pkgFile = fs.readFileSync(path.join(__dirname, '..', 'package.json')).toString();
const pkgContents = JSON.parse(pkgFile);

let action = process.argv[2];

enum AllowedCliArgs {
  setup = 'setup',
  '--version' = '--version',
  '-v' = '-v',
  run = 'run',
}
if (action == '-v' || action == '--version') {
  action = 'version';
}

setupFolderIfNotExists()

switch (action) {
  case 'setup':
    setupUser();
    break;
  case 'version':
    console.log(pkgContents.version);
    break;
  case 'run':
    if (!orchestrator) {
      console.error(
        chalk.red(
          'there was a configuration error, ensure that you have run "setup" first before attempting "run"'
        )
      );
      process.exit(1);
    }
    orchestrator();
    break;
  default:
    console.warn(
      chalk.red(
        `the argument you passed "${action}" is not recognized, available actions are ${Object.keys(
          AllowedCliArgs
        )}`
      )
    );
}

function setupFolderIfNotExists() {
  const userDataDir = path.join(process.cwd(), 'userData');
  if (!fs.existsSync(userDataDir)) {
    console.log('userDataDir does not exist. will create at: ', userDataDir);
    fs.mkdirSync(userDataDir);
  }
}
