// tslint:disable:no-console

import { Message } from './messages';

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
    console.log(msg);
    console.log(JSON.stringify(msg, null, 2));
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
