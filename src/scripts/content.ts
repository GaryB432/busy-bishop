// tslint:disable:no-console

import '../styles/base.scss';

import { getElementPath } from './domutils';
import { MakeSuggestionMessage, Message, ParentAndIndex } from './messages';
import { Popup } from './popup';

const popup: Popup = new Popup();

const lastPointer: WebKitPoint = { x: 0, y: 0 };

popup.start(document.body, 'Suggested Edit');

function sendMessage(
  message: Message,
  responseCallback?: (response: any) => void
): void {
  chrome.runtime.sendMessage(message, responseCallback);
}

function messageHandler(
  msg: Message,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) {
  if (msg.type === 'START_SUGGESTION') {
    const elem = document.elementFromPoint(lastPointer.x, lastPointer.y);
    const original = elem.textContent;
    if (original) {
      popup.run(msg.selectionText, suggestedText => {
        const selectionStart = original.indexOf(msg.selectionText);
        const elementPath: ParentAndIndex[] = getElementPath(elem);
        const makeSuggestionMessage: MakeSuggestionMessage = {
          elementPath,
          href: window.location.href,
          original,
          selectionLength: msg.selectionText.length,
          selectionStart,
          suggestedText,
          type: 'MAKE_SUGGESTION',
        };
        sendMessage(makeSuggestionMessage, sendResponse);
        printSuggestionMessage(makeSuggestionMessage);
      });
    }
  }
}

function printSuggestionMessage(msg: MakeSuggestionMessage) {
  const parts = [
    msg.original.slice(0, msg.selectionStart),
    msg.suggestedText,
    msg.original.slice(msg.selectionStart + msg.selectionLength),
  ];
  console.log(msg);
  console.log(parts.join('<<->>'));
}

document.addEventListener('pointermove', evt => {
  lastPointer.x = evt.x;
  lastPointer.y = evt.y;
});

chrome.runtime.onMessage.addListener(messageHandler);
