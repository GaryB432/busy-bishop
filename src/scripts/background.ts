// tslint:disable:no-console

import * as messages from './lib/messages';
import * as xhr from './lib/xhr';

chrome.contextMenus.onClicked.addListener(
  (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined) => {
    if (tab && tab.id && info.selectionText) {
      chrome.tabs.sendMessage(
        tab.id,
        {
          selectionText: info.selectionText,
          type: 'START_SUGGESTION',
        },
        response => {
          // console.log('handling...', response);
          console.log(JSON.stringify(response, null, 2));
          xhr.getJSON<any>('https://bortosky.com/theater.json').then(a => {
            console.log(a);
          });
          xhr
            .send<messages.MakeSuggestionMessage, void>(
              'http://example.com',
              response
            )
            .then(
              data => {
                console.log('Yep: ' + data);
              },
              _status => {
                console.error('Something went wrong.');
              }
            );
        }
      );
    }
  }
);

chrome.browserAction.onClicked.addListener(tab => {
  // No tabs or host permissions needed!
  console.log('Turning ' + tab.url + ' red!');
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="red"',
  });
});

chrome.contextMenus.create({
  contexts: ['selection'],
  id: 'start',
  title: 'Suggest Edit',
});

console.log('Loaded.');
