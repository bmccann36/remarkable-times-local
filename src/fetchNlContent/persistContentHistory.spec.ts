import * as fs from "fs";
import * as path from "path";
import { HydratedNl } from "../commonModels/HydratedNewsletter";
import { NewsletterData } from "../commonModels/NewsletterData";
import { newsletterMap } from "../static/newsletters";
import recordHistoryAndFilterOldContent from "./persistContentHistory";

const fetchedPagesDir = path.join(__dirname, "..", "..", "/fetchedPages");

const nlNames = Object.keys(newsletterMap)
const hydratedNlData: HydratedNl[] = nlNames.map(
  (nlName: string) => {
    const nlData: NewsletterData = newsletterMap[nlName]
    const fileContent: Buffer = fs.readFileSync(
      fetchedPagesDir + "/" + nlData.title + ".html"
    );
    return Object.assign(nlData, { html: fileContent.toString() });
  }
);


recordHistoryAndFilterOldContent(hydratedNlData);


