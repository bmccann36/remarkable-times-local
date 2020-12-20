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

switch (action) {
  case 'setup':
    setupUser();
    break;
  case 'version':
    console.log(pkgContents.version);
    break;
  case 'run':
    // eslint-disable-next-line no-case-declarations
    let orchestrator;
    try {
      /*eslint-disable*/ orchestrator = require('./main').orchestrator; /*eslint-enable*/
    } catch (err) {
      console.error('orchestrator not imported');
    }
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
