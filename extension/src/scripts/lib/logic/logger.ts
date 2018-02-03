export interface AppInsightsProperties {
  [index: string]: string;
}

export interface AppInsightsMeasurements {
  [index: string]: number;
}

export interface MakeSuggestionLogProps extends AppInsightsProperties {
  location: string;
  selectedText: string;
  submitter: string;
  suggestedText: string;
  pathname: string;
}

export interface SubjectNotFoundLogProps extends AppInsightsProperties {
  location: string;
  selectedText: string;
}

export class ConsoleLogger {
  public static trackPageView(
    name?: string,
    url?: string,
    properties?: AppInsightsProperties,
    measurements?: AppInsightsMeasurements,
    duration?: number
  ): any {
    return console.log(name, url, properties, measurements, duration);
  }

  public static trackEvent(
    name: string,
    properties?: AppInsightsProperties,
    measurements?: AppInsightsMeasurements
  ): any {
    return console.log(name, properties, measurements);
  }
}
