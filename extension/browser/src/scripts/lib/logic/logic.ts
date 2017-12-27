/* tslint:disable-next-line:no-var-requires */
const uuidv4 = require('uuid');
import { SuggestionDocument } from '../../../../../../common';
import * as utils from '../utilities';
import * as domutils from './domutils';
import { MakeSuggestionCommand, StartSuggestionCommand } from './models';
import { MessageSender } from './sender';

export class Logic {
  constructor(private bus: MessageSender) {}
  public onStartSuggestion(selectionText: string): void {
    const command: StartSuggestionCommand = {
      id: uuidv4(),
      selectionText,
      type: 'START_SUGGESTION',
    };
    this.bus.send(command);
  }

  public omMakeSuggestion(command: MakeSuggestionCommand): void {
    console.log(JSON.stringify(command.data, null, 2));
    // console.log(command.data);
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
    const elementPath = utils.serializePath(domutils.getElementPath(element));
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

  public sendMakeSuggestion(document: SuggestionDocument): void {
    const command: MakeSuggestionCommand = {
      data: document,
      type: 'MAKE_SUGGESTION',
    };
    this.bus.send(command);
  }
}
