import * as Epub from "epub-gen";
import * as path from "path";
import { HydratedNl } from "../commonModels/HydratedNewsletter";

const today = new Date();
const dateStr = today.getMonth() + 1 + "-" + today.getDate();

const generateEbook = function (hydratedNl: HydratedNl, fullFilePath: string) {
  /**
   * create the ebook
   */
  const ebookOptions = {
    tempDir: process.env.TEMP_DIR_PATH,
    title: hydratedNl.title,
    author: "The New York Times",
    cover: path.join(__dirname, "..", "..", "/images/nytImage.png"), // Url or File path, both ok.
    content: [
      {
        title: hydratedNl.title,
        data: hydratedNl.html,
      },
    ],
  };
  /**
   * write the epub to file
   */
  new Epub(ebookOptions, fullFilePath);
};

export default generateEbook;
