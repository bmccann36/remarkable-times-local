import {
  NlMap as NewsletterMap,
  NlNameEnum,
} from "../commonModels/NewsletterData";

export const newsletterMap: NewsletterMap = {
  [NlNameEnum.MORNING_BRIEFING]: {
    displayName: "Morning Briefing",
    url: "https://static.nytimes.com/email-content/NN_sample.html",
  },
  [NlNameEnum.CORONA_BRIEFING]: {
    displayName: "Coronavrius Briefing",
    url: "https://static.nytimes.com/email-content/CB_sample.html",
  },
  [NlNameEnum.EVENING_BRIEFING]: {
    displayName: "Evening Briefing",
    url: "https://static.nytimes.com/email-content/NE_sample.html",
  },
  [NlNameEnum.NYC_BRIEFING]: {
    displayName: "New York Today",
    url: "https://static.nytimes.com/email-content/UR_sample.html",
  },
};
