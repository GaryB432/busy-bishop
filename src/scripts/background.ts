// tslint:disable:no-console

import { MakeSuggestionMessage, Message } from './messages';
import { getJSON, send } from './xhr';

interface Theater {
  producers: any[];
}

function sendMessage(
  tabId: number,
  message: Message,
  responseCallback?: (response: any) => void
): void {
  chrome.tabs.sendMessage(tabId, message, responseCallback);
}

function messageHandler(
  msg: Message,
  _sender: chrome.runtime.MessageSender,
  _sendResponse: (response: any) => void
) {
  if (msg.type === 'MAKE_SUGGESTION') {
    console.log(JSON.stringify(msg, null, 2));

    getJSON<Theater>('http://bortosky.com/theater.json').then(
      t => {
        console.log(t.producers[0]);
      },
      _status => {
        console.error('Something went wrong.');
      }
    );

    send<MakeSuggestionMessage, number>('http://example.com', msg).then(
      data => {
        console.log('Yep: ' + data);
      },
      _status => {
        console.error('Something went wrong.');
      }
    );
  }
}

chrome.browserAction.setBadgeText({ text: 'ON' });

chrome.runtime.onInstalled.addListener(() => {
  console.log('Installed.');
});

// chrome.browserAction.onClicked.addListener(() => { });

chrome.contextMenus.onClicked.addListener(
  (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined) => {
    if (tab && tab.id && info.selectionText) {
      sendMessage(tab.id, {
        selectionText: info.selectionText,
        type: 'START_SUGGESTION',
      });
    }
  }
);

chrome.contextMenus.create({
  contexts: ['selection'],
  id: 'start',
  title: 'Suggest Edit',
});

chrome.alarms.onAlarm.addListener(() => {
  alert("Time's up!");
});

chrome.runtime.onSuspend.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, _tabs => {
    // After the unload event listener runs, the page will unload, so any
    // asynchronous callbacks will not fire.
    // alert("Yet This does show up.");
  });
  console.log('Unloading.');
  chrome.browserAction.setBadgeText({ text: '' });
  // if (lastTabId) {
  //   chrome.tabs.sendMessage(lastTabId, "Background page unloaded.");
  // }
});

chrome.runtime.onMessage.addListener(messageHandler);

console.log('Loaded.');
