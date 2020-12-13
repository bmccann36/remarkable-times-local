// import * as fs from 'fs';
// import * as path from 'path';
// import { HydratedNl } from '../commonModels/HydratedNewsletter';
// import { NewsletterData } from '../commonModels/NewsletterData';
// import recordHistoryAndFilterOldContent from './persistContentHistory';
// import { newsletters } from '../static/newsletters';
// const fetchedPagesDir = path.join(__dirname, '..', '..', '/fetchedPages');

// const hydratedNlData: HydratedNl[] = newsletters.map((nlData: NewsletterData) => {
//   const fileContent: Buffer = fs.readFileSync(fetchedPagesDir + '/' + nlData.title + '.html');
//   return Object.assign(nlData, { html: fileContent.toString() });
// });

// recordHistoryAndFilterOldContent(hydratedNlData);
