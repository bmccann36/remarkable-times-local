import deliverNlEbooks from "../fetchNlContent/deliverNlEbooks";
export interface NewsletterData {
  newsletterId: string,
  title: string;
  sampleUrl: string;
  deliveryInfo: DeliveryInfo; //TODO deprecate in favor of nyt format
  caption?: string;
}

export interface DeliveryInfo {
  timeOfDay: "morning" | "evening";
  frequency: "weekdays" | "weekends" | "custom";
}

type NlNames =
  | "MORNING_BRIEFING"
  | "EVENING_BRIEFING"
  | "CORONA_BRIEFING"
  | "NYC_BRIEFING";

export type NlMap = { [key in NlNames]: NewsletterData };
