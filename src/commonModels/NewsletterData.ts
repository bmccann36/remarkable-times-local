import deliverNlEbooks from "../fetchNlContent/deliverNlEbooks";
export interface NewsletterData {
  displayName: string;
  url: string;
  deliveryInfo: DeliveryInfo;
  description?: string;
}

interface DeliveryInfo {
  timeOfDay: "morning" | "evening";
  frequency: "weekdays" | "weekends" | "custom";
}

type NlNames =
  | "MORNING_BRIEFING"
  | "EVENING_BRIEFING"
  | "CORONA_BRIEFING"
  | "NYC_BRIEFING";

export type NlMap = { [key in NlNames]: NewsletterData };
