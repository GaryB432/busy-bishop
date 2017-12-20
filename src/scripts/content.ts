// tslint:disable:no-console

import { Dialog } from './lib/dialog';
import * as domutils from './lib/domutils';
import * as messages from './lib/messages';
import { lastPointer } from './lib/pointer';

import '../styles/content.scss';

const dialog: Dialog = new Dialog();

dialog.start(document.body, 'Suggested Edit');

function handleError(e: domutils.SuggestionSubjectError) {
  console.log(e, 'sorry');
}

function startSuggestion(
  request: messages.StartSuggestionMessage
): Promise<messages.MakeSuggestionMessage> {
  function makeMessage(
    path: messages.ParentAndIndex[],
    subject: domutils.SuggestionSubjectInfo
  ) {
    const context = subject.textNode!.textContent!;
    const message: messages.MakeSuggestionMessage = {
      context,
      elementPath: path,
      href: window.location.href,
      selectedText: request.selectionText,
      selectionStart: context.indexOf(request.selectionText),
      suggestedText: 'TBD...',
      textNodeIndex: subject.textNodeIndex,
      type: 'MAKE_SUGGESTION',
    };
    return message;
  }

  return new Promise<messages.MakeSuggestionMessage>(
    async (resolve, reject) => {
      const elem = document.elementFromPoint(lastPointer.x, lastPointer.y);
      const path = domutils.getElementPath(elem);
      try {
        const subject = await domutils.getSubjectInfo(
          path,
          request.selectionText
        );
        const message: messages.MakeSuggestionMessage = makeMessage(
          path,
          subject
        );
        console.log(`about to run ${request.selectionText}`);
        dialog.doRun(request.selectionText).then(suggestedText => {
          message.suggestedText = suggestedText;
          resolve(message);
          console.log(`resolved ${request.selectionText}`);
        });
      } catch (e) {
        reject(e);
      }
    }
  );
}

chrome.runtime.onMessage.addListener(
  (request: messages.Message, _sender, sendResponse) => {
    switch (request.type) {
      case 'START_SUGGESTION':
        startSuggestion(request)
          .then(sendResponse)
          .catch(handleError);
        break;
    }
    return true;
  }
);
