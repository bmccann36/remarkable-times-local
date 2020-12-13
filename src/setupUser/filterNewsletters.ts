import { newsletters } from '../static/newsletters';

const nlIdsToKeep = [
  'NN',
  'CN',
  'NE',
  'GN',
  'DY',
  'WAR',
  'CA',
  'INT',
  'UR',
  'MA',
  'SP',
  'SC',
  'UP',
  'DB',
  'JBO',
  'PK',
  'OWR',
  'OT',
  'WIN',
  'MY',
  'AH',
  'LI',
  'LL',
];

export const filteredNls = newsletters.filter((nlData) => {
  if (nlIdsToKeep.includes(nlData.newsletterId)) {
    return true;
  } else {
    return false;
  }
});
