// tslint:disable:no-console
import '../styles/content.scss';

import {
  MakeSuggestionMessage,
  Message,
  StartSuggestionMessage,
} from '../../../../common';
import { Dialog } from './lib/dialog';
import * as domutils from './lib/domutils';
import { lastPointer } from './lib/pointer';

const dialog: Dialog = new Dialog();

dialog.start(document.body, 'Suggested Edit');

function startSuggestion(
  request: StartSuggestionMessage
): Promise<MakeSuggestionMessage> {
  const elem = document.elementFromPoint(lastPointer.x, lastPointer.y);

  return new Promise<MakeSuggestionMessage>(async resolve => {
    const msm: Partial<MakeSuggestionMessage> = {
      createdAt: new Date().getTime(),
      elementPath: domutils.getElementPath(elem),
      href: window.location.href,
      id: request.id,
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
      msm.suggestedText = await dialog.doRun(
        msm.context.slice(0, msm.selectionStart),
        request.selectionText,
        msm.context.slice(msm.selectionStart + request.selectionText.length)
      );
      if (msm.suggestedText) {
        msm.status = 'OK';
        msm.textNodeIndex = subject.textNodeIndex;
        console.log(`resolved ${request.selectionText}`);
      }
    } else {
      alert('Select just a small piece of text within a single element');
    }

    resolve(msm as MakeSuggestionMessage);
  });
}

chrome.runtime.onMessage.addListener(
  (request: Message, _sender, sendResponse) => {
    switch (request.type) {
      case 'START_SUGGESTION':
        startSuggestion(request).then(sendResponse);
        break;
    }
    return true;
  }
);
