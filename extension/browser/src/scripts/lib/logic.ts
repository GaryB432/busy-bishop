const uuidv4 = require('uuid');
import * as domutils from './domutils';

export type ParentAndIndex = [string, number];

export interface SuggestionDocument {
  id: string;
  elementPath: ParentAndIndex[];
  context: string;
  textNodeIndex: number;
  selectedText: string;
  selectionStart: number;
  suggestedText?: string;
  href: string;
  createdAt: number;
}
export interface StartSuggestionCommand {
  type: 'START_SUGGESTION';
  id: string;
  selectionText: string;
}
export interface StartSuggestionResponse {
  type: 'START_SUGGESTION_RESPONSE';
  command: StartSuggestionCommand;
  status: 'OK' | 'ERROR' | 'WAITING';
}
export interface MakeSuggestionCommand {
  type: 'MAKE_SUGGESTION';
  data: SuggestionDocument;
}
export interface MakeSuggestionResponse {
  type: 'MAKE_SUGGESTION_RESPONSE';
  data: SuggestionDocument;
  status: 'OK' | 'ERROR';
}

export class FakePopup {
  public async doRun(
    front: string,
    selected: string,
    back: string
  ): Promise<string> {
    return new Promise<string>((resolve, _reject) => {
      console.log(front, selected, back);
      // reject('not yet');
      window.setTimeout(() => resolve(`changed ${selected}`), 5000);
    });
  }
}

export abstract class MessageBus {
  public abstract send(
    command: StartSuggestionCommand | MakeSuggestionCommand
  ): void;
}

export class MessageBusChrome extends MessageBus {
  public send(command: StartSuggestionCommand | MakeSuggestionCommand): void {
    console.log('sending', command);
    switch (command.type) {
      case 'MAKE_SUGGESTION':
        chrome.runtime.sendMessage(command, this.handleReponse);
        break;
      case 'START_SUGGESTION':
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          const tid = tabs[0].id!;
          chrome.tabs.sendMessage(tid, command, this.handleReponse);
        });
        break;
    }
  }
  private handleReponse(response: StartSuggestionResponse) {
    console.log('ignoring ', response);
  }
}

export class Logic {
  constructor(private bus: MessageBus) {}
  public handleStartClick(_positionmaybe: any, selectionText: string): void {
    const command: StartSuggestionCommand = {
      id: uuidv4(),
      selectionText,
      type: 'START_SUGGESTION',
    };
    this.bus.send(command);
  }

  public sendMakeSuggestion(document: SuggestionDocument): void {
    const command: MakeSuggestionCommand = {
      data: document,
      type: 'MAKE_SUGGESTION',
    };
    this.bus.send(command);
  }

  public handleMakeCommand(command: MakeSuggestionCommand): void {
    console.log(JSON.stringify(command.data, null, 2));
  }

  public async getSuggestionFromUser(
    point: WebKitPoint,
    command: StartSuggestionCommand,
    getSuggestedText: (document: SuggestionDocument) => Promise<string>
  ): Promise<SuggestionDocument> {
    const element = document.elementFromPoint(
      point.x,
      point.y
    ) as HTMLElement | null;
    if (!element) {
      throw new Error('wtf with elementFromPoint()');
    }
    const elementPath = domutils.getElementPath(element);
    const href = window.location.href;
    return new Promise<SuggestionDocument>(async (resolve, reject) => {
      const textInfo = domutils.getSubjectInfo(element, command.selectionText);
      const textNodeIndex = textInfo.textNodeIndex;
      if (textInfo.textNodeIndex > -1) {
        const context = element.childNodes.item(textInfo.textNodeIndex)
          .textContent!;
        const selectionStart = context.indexOf(command.selectionText);
        const createdAt = new Date().getTime();
        const selectedText = command.selectionText;
        const doc: SuggestionDocument = {
          context,
          createdAt,
          elementPath,
          href,
          id: command.id,
          selectedText,
          selectionStart,
          suggestedText: 'TBD',
          textNodeIndex,
        };
        doc.suggestedText = await getSuggestedText(doc);
        resolve(doc);
      } else {
        console.log(element, textInfo, command.selectionText);
        reject('nope');
      }
    });
  }
}
