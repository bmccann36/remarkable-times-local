import { Remarkable } from 'remarkable-typescript';
import * as getUuid from 'uuid-by-string';
import * as path from 'path';
import * as fs  from 'fs';

const userDataDir = path.join(__dirname, 'userData');

const deviceToken = fs.readFileSync(`${userDataDir}/deviceToken.txt`).toString();
const client = new Remarkable({ deviceToken });

(async () => {
  await client.refreshToken();

  const dirCreateRes = await client.createDirectory('rmt-dev-windows', getUuid('rmt-dev-windows'));
  console.log(dirCreateRes);
})();
