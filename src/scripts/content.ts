// tslint:disable:no-console

import { Dialog } from './lib/dialog';
import * as domutils from './lib/domutils';
import * as messages from './lib/messages';
import { lastPointer } from './lib/pointer';

import '../styles/content.scss';

const dialog: Dialog = new Dialog();

dialog.start(document.body, 'Suggested Edit');

async function startSuggestion(
  request: messages.StartSuggestionMessage
): Promise<messages.MakeSuggestionMessage> {
  return new Promise<messages.MakeSuggestionMessage>(
    async (resolve, _reject) => {
      const elem = document.elementFromPoint(lastPointer.x, lastPointer.y);

      const path = domutils.getElementPath(elem);

      const subject = await domutils.getSubjectInfo(
        path,
        request.selectionText
      );
      const context = subject.textNode!.textContent!;

      const makeSuggestionMessage: messages.MakeSuggestionMessage = {
        context,
        elementPath: path,
        href: window.location.href,
        selectedText: request.selectionText,
        selectionStart: context.indexOf(request.selectionText),
        suggestedText: 'TBD...',
        textNodeIndex: subject.textNodeIndex,
        type: 'MAKE_SUGGESTION',
      };

      dialog.doRun(request.selectionText).then(suggestedText => {
        makeSuggestionMessage.suggestedText = suggestedText;
        resolve(makeSuggestionMessage);
      });
    }
  );
}

chrome.runtime.onMessage.addListener(
  (request: messages.Message, _sender, sendResponse) => {
    switch (request.type) {
      case 'START_SUGGESTION':
        startSuggestion(request)
          .then(response => {
            sendResponse(response);
          })
          .catch(e => console.log(e));
        break;
    }
    return true;
  }
);
