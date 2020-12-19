#!/usr/bin/env node
import * as chalk from 'chalk';
import { setupUser } from './setupUser/main';
const action = process.argv[2];

switch (action) {
  case 'setup':
    setupUser()
    break;
  // case y:
  //   // code block
  //   break;
  default:
    console.warn(
      chalk.red(
        `the argument you passed "${action}" is not recognized, available actions are "setup", and "run"`
      )
    );
}
