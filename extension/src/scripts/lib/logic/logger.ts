export interface AppInsightsProperties {
  [index: string]: string;
}

export interface LoggerProperties extends AppInsightsProperties {
  location: string;
  selectedText: string;
  submitter: string;
  suggestedText: string;
  pathname: string;
}

export class Logger {
  public static trackPageView(
    name?: string,
    url?: string,
    properties?: AppInsightsProperties,
    measurements?: { [name: string]: number },
    duration?: number
  ): any {
    return console.log(name, url, properties, measurements, duration);
  }

  public static trackEvent(
    name: string,
    properties?: AppInsightsProperties,
    measurements?: { [name: string]: number }
  ): any {
    return console.log(name, properties, measurements);
  }
}
