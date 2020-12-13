import deliverNlEbooks from '../fetchNlContent/deliverNlEbooks';
export interface NewsletterData {
  newsletterId: string;
  slug: string;
  title: string;
  caption: string;
  altText: string;
  sampleUrl: string;
  figureImageUrl: string;
  titleImage: string;
  altTextLogo?: string;
  titleFont: string;
  frequency: string;
  thumbImageUrl: string;
  id: string;
}

export type NlMap = { [key: string]: NewsletterData };
