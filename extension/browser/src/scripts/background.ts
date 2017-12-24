// tslint:disable:no-console no-var-requires
const uuidv4 = require('uuid');

import { MakeSuggestionMessage } from '../../../../common';
import * as xhr from './lib/xhr';

function handleSuggestionResponse(suggestion: MakeSuggestionMessage): void {
  console.log(JSON.stringify(suggestion, null, 2));
  switch (suggestion.status) {
    case 'OK':
      xhr.getJSON<any>('https://bortosky.com/theater.json').then(a => {
        console.log(a);
      });
      xhr
        .send<MakeSuggestionMessage, void>('http://example.com', suggestion)
        .then(
          data => {
            console.log('Yep: ' + data);
          },
          _status => {
            console.error('Something went wrong.');
          }
        );
      break;
    case 'ERROR':
      console.log('not doing much');
      break;
    default:
      throw new Error('zomg');
  }
}

chrome.contextMenus.onClicked.addListener(
  (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined) => {
    if (tab && tab.id && info.selectionText) {
      chrome.tabs.sendMessage(
        tab.id,
        {
          id: uuidv4(),
          selectionText: info.selectionText,
          type: 'START_SUGGESTION',
        },
        response => {
          if (response) {
            handleSuggestionResponse(response);
          } else {
            console.log(chrome.runtime.lastError, 'oops');
          }
        }
      );
    }
  }
);

chrome.contextMenus.create({
  contexts: ['selection'],
  id: 'start',
  title: 'Suggest Edit',
});

import { MessageBus, Logic, MakeSuggestionCommand } from './lib/logic';
const logic = new Logic(new MessageBus());
function setup() {
  chrome.contextMenus.onClicked.addListener((info, _tab) => {
    console.log(info, _tab);
    if (info.selectionText) {
      logic.handleStartClick('xy,element', info.selectionText);
      // const r = this.logic.createMakeCommand('dom', info.selectionText)
    }
  });
  chrome.runtime.onMessage.addListener(
    (m: MakeSuggestionCommand, _sender, sendResponse) => {
      // this.logic.handleStartClick(m);
      console.log(m);
      sendResponse(undefined);
    }
  );
}

console.log('Loaded.');
