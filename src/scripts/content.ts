// tslint:disable:no-console

import { Dialog } from './lib/dialog';
import * as domutils from './lib/domutils';
import * as messages from './lib/messages';
import { lastPointer } from './lib/pointer';

import '../styles/content.scss';

const dialog: Dialog = new Dialog();

dialog.start(document.body, 'Suggested Edit');

function handleError(e: domutils.SuggestionSubjectError) {
  if (!!e.element) {
    const el = e.element;
    const containingNodes = e.tnc.map(i => el.childNodes.item(i));
    console.log(containingNodes.map(n => n.textContent), 'sorry');
  }
}

function startSuggestion(
  request: messages.StartSuggestionMessage
): Promise<messages.MakeSuggestionMessage> {
  function getInitializedMessage(
    path: messages.ParentAndIndex[],
    subject: domutils.SuggestionSubjectInfo
  ): messages.MakeSuggestionMessage {
    const context = subject.textNode!.textContent!;
    const message: messages.MakeSuggestionMessage = {
      context,
      elementPath: path,
      href: window.location.href,
      selectedText: request.selectionText,
      selectionStart: context.indexOf(request.selectionText),
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
        const message: messages.MakeSuggestionMessage = getInitializedMessage(
          path,
          subject
        );
        console.log(`about to run ${request.selectionText}`);
        message.suggestedText = await dialog.doRun(request.selectionText);
        if (message.suggestedText) {
          resolve(message);
          console.log(`resolved ${request.selectionText}`);
        }
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
