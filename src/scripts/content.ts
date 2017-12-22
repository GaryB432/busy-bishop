// tslint:disable:no-console

import { Dialog } from './lib/dialog';
import * as domutils from './lib/domutils';
import * as messages from './lib/messages';
import { lastPointer } from './lib/pointer';

import '../styles/content.scss';

const dialog: Dialog = new Dialog();

dialog.start(document.body, 'Suggested Edit');

function startSuggestion(
  request: messages.StartSuggestionMessage
): Promise<messages.MakeSuggestionMessage> {
  const elem = document.elementFromPoint(lastPointer.x, lastPointer.y);

  return new Promise<messages.MakeSuggestionMessage>(async resolve => {
    const msm: Partial<messages.MakeSuggestionMessage> = {
      elementPath: domutils.getElementPath(elem),
      href: window.location.href,
      selectedText: request.selectionText,
      status: 'WAITING',
      textNodeIndex: -1,
      type: 'MAKE_SUGGESTION',
    };

    const subject = await domutils.getSubjectInfo(
      msm.elementPath!,
      request.selectionText
    );

    msm.status = 'ERROR';
    if (subject.textNode) {
      msm.context = subject.textNode.textContent!;
      msm.selectionStart = msm.context.indexOf(request.selectionText);
      console.log(`about to run ${request.selectionText}`);
      msm.suggestedText = await dialog.doRun(request.selectionText);
      if (msm.suggestedText) {
        msm.status = 'OK';
        console.log(`resolved ${request.selectionText}`);
      }
    } else {
      alert('Select just a small piece of text within a single element');
    }

    resolve(msm as messages.MakeSuggestionMessage);
  });
}

chrome.runtime.onMessage.addListener(
  (request: messages.Message, _sender, sendResponse) => {
    switch (request.type) {
      case 'START_SUGGESTION':
        startSuggestion(request).then(sendResponse);
        break;
    }
    return true;
  }
);
