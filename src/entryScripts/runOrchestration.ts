import * as dotenv from 'dotenv';
import * as path from 'path';
//? CONFIGURE ENV VARS
if (process.env.NODE_ENV == 'dev') {
  console.log('USING DEV CONFIG');
  dotenv.config({ path: path.join(__dirname, '..', '..', 'dev.env') });
} else {
  // typically .env would find this path on its own but not true when run as global node module
  dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
}

import { orchestrator } from '../main';

orchestrator();
