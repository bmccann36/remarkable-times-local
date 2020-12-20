#!/usr/bin/env node
import * as dotenv from 'dotenv';
import * as path from 'path';

//? CONFIGURE ENV VARS
if (process.env.NODE_ENV == 'dev') {
  console.log('USING DEV CONFIG');
  dotenv.config({ path: path.join(__dirname, '..', 'dev.env') });
} else {
  // since user is manually invoking this from cli we want slightly different behavior
  dotenv.config();
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
    process.env.LOG_OVERWRITE = 'false'; // we just want plain console output for this
    setupUser();
    break;
  case 'version':
    console.log(pkgContents.version);
    break;
  case 'run':
    process.env.LOG_OVERWRITE = 'true'; // all logs will pipe into tslog
    process.env.LOG_COLORIZE = 'true';
    // eslint-disable-next-line no-case-declarations
    let orchestrator;
    try {
      /* eslint-disable */ orchestrator = require('./main').orchestrator; /* eslint-enable*/
    } catch (err) {
      console.error(err);
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
