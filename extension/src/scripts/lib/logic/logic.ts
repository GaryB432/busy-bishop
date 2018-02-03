/* tslint:disable-next-line:no-var-requires */
const uuidv4 = require('uuid');
import { EventEmitter } from 'events';
import { Observable } from 'rxjs/Observable';
import { SuggestionDocument } from '../../../imported/models';
import { AzureDataService, DataService } from '../data/data';
import { MockDataService } from '../data/mock-data';
import * as utils from '../utilities';
import * as domutils from './domutils';
import {
  AppInsightsMeasurements,
  AppInsightsProperties,
  ConsoleLogger,
  MakeSuggestionLogProps,
  SubjectNotFoundLogProps,
} from './logger';
import { MakeSuggestionCommand, StartSuggestionCommand } from './models';
import { MessageSender, MessageSenderChrome } from './sender';

type LogEventName = 'MAKE_SUGGESTION' | 'ELEMENT_NOT_FOUND';

export class Logic {
  private readonly events = new EventEmitter();
  // public trackEvent?: (
  //   name: string,
  //   properties?: AppInsightsProperties,
  //   measurements?: AppInsightsMeasurements
  // ) => void = ConsoleLogger.trackEvent;
  constructor(
    private bus: MessageSender = new MessageSenderChrome(),
    private dataSvc: DataService = window.location.hostname === 'localhost'
      ? new MockDataService()
      : new AzureDataService()
  ) {
    this.on('ELEMENT_NOT_FOUND', (p, m) =>
      ConsoleLogger.trackEvent('ELEMENT_NOT_FOUND', p, m)
    );
  }

  public get suggestions(): Observable<SuggestionDocument[]> {
    return this.dataSvc.suggestions;
  }

  public addListener(
    event: LogEventName,
    listener: (
      properties?: AppInsightsProperties,
      measurements?: AppInsightsMeasurements
    ) => void
  ): EventEmitter {
    return this.events.addListener(event, listener);
  }

  public on(
    event: LogEventName,
    listener: (
      properties?: AppInsightsProperties,
      measurements?: AppInsightsMeasurements
    ) => void
  ): EventEmitter {
    return this.events.on(event, listener);
  }

  public onPopupLoaded(url: string): void {
    this.dataSvc.loadForLocation(utils.cleanLocation(url));
  }
  public onStartSuggestion(selectionText: string, submitter: string): void {
    const command: StartSuggestionCommand = {
      id: uuidv4(),
      selectionText,
      submitter,
      type: 'START_SUGGESTION',
    };
    this.bus.send(command);
  }

  public onMakeSuggestion(command: MakeSuggestionCommand): void {
    this.dataSvc.create(command.data);
    // console.log(command.data);
  }

  public async getSuggestionFromUser(
    point: WebKitPoint,
    command: StartSuggestionCommand,
    getSuggestedText: (document: SuggestionDocument) => Promise<string>
  ): Promise<SuggestionDocument> {
    const { hash, host, pathname, protocol, search } = window.location;
    const location = utils.cleanLocation(window.location);
    const subject = domutils.getSubjectInfo(
      point.x,
      point.y,
      command.selectionText
    );
    return new Promise<SuggestionDocument>(async (resolve, reject) => {
      if (!!subject.element && subject.textNodeIndex > -1) {
        const elementPath = utils.serializePath(
          domutils.getElementPath(subject.element)
        );
        const textNodeIndex = subject.textNodeIndex;
        const context = subject.element.childNodes.item(subject.textNodeIndex)
          .textContent!;
        const sp = utils.single(
          utils.getStartIndices(context, command.selectionText)
        )!;
        const selectionStart = sp.index;
        const createdAt = new Date().getTime();
        const selectedText = command.selectionText;
        const submitter = command.submitter;
        const doc: SuggestionDocument = {
          context,
          createdAt,
          elementPath,
          id: command.id,
          location,
          selectedText,
          selectionStart,
          submitter,
          textNodeIndex,
          url: {
            hash,
            host,
            pathname,
            protocol,
            search,
          },
        };
        doc.suggestedText = await getSuggestedText(doc);
        resolve(doc);
      } else {
        alert('Please select one or a few words from a single element.');
        this.logElementNotFound(location, point, command);
        reject(
          `The selected text needs to exist one time in one text node. "${
            command.selectionText
          }" does not.`
        );
      }
    });
  }

  public sendMakeSuggestion(document: SuggestionDocument): void {
    const command: MakeSuggestionCommand = {
      data: document,
      type: 'MAKE_SUGGESTION',
    };
    this.logMakeSuggestion(command);
    this.bus.send(command);
  }

  public newId(): string {
    return uuidv4();
  }

  private logElementNotFound(
    location: string,
    point: WebKitPoint,
    command: StartSuggestionCommand
  ): void {
    const props: SubjectNotFoundLogProps = {
      location,
      selectedText: command.selectionText,
    };
    const { x, y } = point;
    const measurements: AppInsightsMeasurements = { x, y };
    this.events.emit('ELEMENT_NOT_FOUND', props, measurements);
  }

  private logMakeSuggestion(command: MakeSuggestionCommand): void {
    const doc = command.data;
    const props: MakeSuggestionLogProps = {
      location: doc.location,
      pathname: doc.url.pathname,
      selectedText: doc.selectedText,
      submitter: doc.submitter,
      suggestedText: doc.suggestedText!,
    };
    this.events.emit(command.type, props);
  }
}
