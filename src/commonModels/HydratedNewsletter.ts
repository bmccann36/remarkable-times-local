import { NewsletterData } from "./NewsletterData";

export interface HydratedNl extends NewsletterData  {
  html: string;
}