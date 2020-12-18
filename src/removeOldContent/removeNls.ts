import * as fs from 'fs';
import * as path from 'path';
import { Remarkable } from 'remarkable-typescript';
import * as getUuid from 'uuid-by-string';
import log from '../logger';

const deviceToken = fs.readFileSync(path.join(__dirname, '..', '..', '/userData/deviceToken.txt')).toString();

const removeNls = async function (numToDeliver: number) {
  const client = new Remarkable({ deviceToken });
  await client.refreshToken();
};

export default removeNls;
