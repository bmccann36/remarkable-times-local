import { NlMap as NewsletterMap } from "../commonModels/NewsletterData";

export const newsletterMap: NewsletterMap = {
  MORNING_BRIEFING: {
    displayName: "Morning Briefing",
    url: "https://static.nytimes.com/email-content/NN_sample.html",
    deliveryInfo: { timeOfDay: "morning", frequency: "weekdays" },
  },
  CORONA_BRIEFING: {
    displayName: "Coronavrius Briefing",
    url: "https://static.nytimes.com/email-content/CB_sample.html",
    deliveryInfo: { timeOfDay: "morning", frequency: "weekdays" },
  },
  EVENING_BRIEFING: {
    displayName: "Evening Briefing",
    url: "https://static.nytimes.com/email-content/NE_sample.html",
    deliveryInfo: { timeOfDay: "evening", frequency: "weekdays" },
  },
  NYC_BRIEFING: {
    displayName: "New York Today",
    url: "https://static.nytimes.com/email-content/UR_sample.html",
    deliveryInfo: { timeOfDay: "morning", frequency: "weekdays" },
  },
};
