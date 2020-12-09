import { NlMap as NewsletterMap } from "../commonModels/NewsletterData";

export const newsletterMap: NewsletterMap = {
  MORNING_BRIEFING: {
    newsletterId: "NN",
    title: "Morning Briefing",
    sampleUrl: "https://static.nytimes.com/email-content/NN_sample.html",
    deliveryInfo: { timeOfDay: "morning", frequency: "weekdays" },
  },
  CORONA_BRIEFING: {
    newsletterId: "CB",
    title: "Coronavrius Briefing",
    sampleUrl: "https://static.nytimes.com/email-content/CB_sample.html",
    deliveryInfo: { timeOfDay: "morning", frequency: "weekdays" },
  },
  EVENING_BRIEFING: {
    newsletterId: "NE",
    title: "Evening Briefing",
    sampleUrl: "https://static.nytimes.com/email-content/NE_sample.html",
    deliveryInfo: { timeOfDay: "evening", frequency: "weekdays" },
  },
  NYC_BRIEFING: {
    newsletterId: "UR",
    title: "New York Today",
    sampleUrl: "https://static.nytimes.com/email-content/UR_sample.html",
    deliveryInfo: { timeOfDay: "morning", frequency: "weekdays" },
  },
};
