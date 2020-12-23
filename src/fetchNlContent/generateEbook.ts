import * as Epub from 'epub-gen';
import * as path from 'path';
import { HydratedNl } from '../commonModels/HydratedNewsletter';

const generateEbook = async function (hydratedNl: HydratedNl, fullFilePath: string): Promise<void> {
  /**
   * create the ebook
   */
  const ebookOptions = {
    tempDir: process.env.TEMP_DIR_PATH,
    title: hydratedNl.title,
    author: 'The New York Times',
    cover: path.join(__dirname, '..', '..', '/images/nytImage.png'), // Url or File path, both ok.
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
  return new Epub(ebookOptions, fullFilePath).promise.then(() => null);
};

export default generateEbook;
