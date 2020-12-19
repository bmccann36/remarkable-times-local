import axios from 'axios';
import { DeleteParams } from './removeNls';
import * as fs from 'fs';
import * as path from 'path';
import { Remarkable } from 'remarkable-typescript';

const deviceToken = fs.readFileSync(path.join(__dirname, '..', '..', '/userData/deviceToken.txt')).toString();

export const batchRemove = async function (itemsToRemove: DeleteParams[], token?: string) {
  let authToken;
  if (!token) {
    const client = new Remarkable({ deviceToken });
    await client.refreshToken();
    authToken = client.token;
  } else {
    authToken = token;
  }

  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };

  return axios.put(
    'https://document-storage-production-dot-remarkable-production.appspot.com/document-storage/json/2/delete',
    itemsToRemove,
    config
  );
};
