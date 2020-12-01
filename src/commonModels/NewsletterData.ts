export interface NewsletterData {
  displayName: string;
  url: string;
  description?: string;
}

export enum NlNameEnum {
  MORNING_BRIEFING = "MORNING_BRIEFING",
  EVENING_BRIEFING = "EVENING_BRIEFING",
  CORONA_BRIEFING = "CORONA_BRIEFING",
  NYC_BRIEFING = "NYC_BRIEFING",
}

class NlNames {
  MORNING_BRIEFING = NlNameEnum.MORNING_BRIEFING;
  EVENING_BRIEFING = NlNameEnum.EVENING_BRIEFING;
  CORONA_BRIEFING = NlNameEnum.CORONA_BRIEFING;
  NYC_BRIEFING = NlNameEnum.NYC_BRIEFING;
}

export type NlMap = { [key in keyof NlNames]: NewsletterData };
