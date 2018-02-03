/* tslint:disable-next-line:no-var-requires */
const uuidv4 = require('uuid');
import { Observable } from 'rxjs/Observable';
import { SuggestionDocument } from '../../../imported/models';
import { AzureDataService, DataService } from '../data/data';
import { MockDataService } from '../data/mock-data';
import * as utils from '../utilities';
import * as domutils from './domutils';
import { AppInsightsProperties, Logger, LoggerProperties } from './logger';
import { MakeSuggestionCommand, StartSuggestionCommand } from './models';
import { MessageSender, MessageSenderChrome } from './sender';

export class Logic {
  public trackEvent: (
    name: string,
    properties?: AppInsightsProperties,
    measurements?: { [name: string]: number }
  ) => void = Logger.trackEvent;
  constructor(
    private bus: MessageSender = new MessageSenderChrome(),
    private dataSvc: DataService = window.location.hostname === 'localhost'
      ? new MockDataService()
      : new AzureDataService()
  ) {}
  public get suggestions(): Observable<SuggestionDocument[]> {
    return this.dataSvc.suggestions;
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
        const positions = utils.getStartIndices(context, command.selectionText);
        const sp = utils.single(positions);
        if (!!sp) {
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
          console.log(subject.element, subject, command.selectionText);
          reject(`The selected text "${command.selectionText}" was not found.`);
        }
      } else {
        alert('Please select one or a few words from a single element.');
        console.log(subject.element, subject, command.selectionText);
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
    const props: LoggerProperties = {
      location: document.location,
      pathname: document.url.pathname,
      selectedText: document.selectedText,
      submitter: document.submitter,
      suggestedText: document.suggestedText!,
    };
    Logger.trackEvent(command.type, props);
    this.trackEvent(command.type, props);
    this.bus.send(command);
  }

  public newId(): string {
    return uuidv4();
  }
}
