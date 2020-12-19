import * as fs from 'fs';
import * as path from 'path';
import { ItemResponse, Remarkable } from 'remarkable-typescript';
import * as getUuid from 'uuid-by-string';
import log from '../logger';
import { batchRemove } from './batchRemove';

const deviceToken = fs.readFileSync(path.join(__dirname, '..', '..', '/userData/deviceToken.txt')).toString();
const hashedFolderName = getUuid('Remarkable Times');
const DAY_IN_MS = 86400000;

export interface DeleteParams {
  ID: string;
  Version: number;
}

const removeNls = async function () {
  const client = new Remarkable({ deviceToken });
  await client.refreshToken();

  const allFiles = await client.getAllItems();
  // narrow down to the ones we want to delete
  const filesToDelete = allFiles.filter(filterPredicateFn);

  const itemsToDelete: DeleteParams[] = filesToDelete.map((file) => {
    return {
      ID: file.ID,
      Version: file.Version,
    };
  });
  const removeResponse = await batchRemove(itemsToDelete, client.token);
  log.info('removed files', removeResponse.data);
};


export default removeNls;

/**
 * only returns files that are greater than one day old  and are in the remarkable times folder
 *
 * @param fileMeta
 */
function filterPredicateFn(fileMeta: ItemResponse): boolean {
  const isRMTfile = fileMeta.Parent == hashedFolderName;
  if (fileMeta.Parent && isRMTfile) {
    const modClientDate = new Date(fileMeta.ModifiedClient);
    const nowDate = new Date();
    const ageInMs = nowDate.getTime() - modClientDate.getTime();
    const age = ageInMs / DAY_IN_MS;
    if (age >= 1) {
      return true;
    }
  }
  return false;
}
