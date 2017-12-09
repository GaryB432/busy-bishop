// tslint:disable:no-console
import { Message } from "./messages";

// let counter = 1;

// let lastTabId: number | undefined = -1;
// function sendMessage() {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     for (const tab of tabs) {
//       lastTabId = tab.id;
//       if (lastTabId) {
//         chrome.tabs.sendMessage(lastTabId, "Background page started.");
//       }
//     }
//   });
// }

// sendMessage();
chrome.browserAction.setBadgeText({ text: "ON" });
console.log("Loaded.");

chrome.runtime.onInstalled.addListener(() => {
  console.log("Installed.");
  localStorage.counter = 1;
});

chrome.browserAction.onClicked.addListener(() => {
  // The event page will unload after handling this event (assuming nothing
  // else is keeping it awake). The content script will become the main way to
  // interact with us.
  // chrome.tabs.create({url: "content.html"}, function(tab) {
  //   chrome.tabs.executeScript(tab.id, {file: "scripts/content.js"}, function() {
  //     // Note: we also sent a message above, upon loading the event page,
  //     // but the content script will not be loaded at that point, so we send
  //     // another here.
  //     sendMessage();
  //   });
  // });
  // sendMessage();
});

chrome.commands.onCommand.addListener((_command) => {
  chrome.tabs.create({ url: "http://www.google.com/" });
});

chrome.runtime.onMessage.addListener((msg: Message, _sender, _sendResponse) => {

  if (msg.type === "MAKE_SUGGESTION") {
    console.log(msg);
  }

  // if (msg.setAlarm) {
  //   chrome.alarms.create({ delayInMinutes: 0.1 });
  // } else if (msg.delayedResponse) {
  //   setTimeout(() => {
  //     sendResponse("Got your message.");
  //   }, 5000);
  //   return true;
  // } else if (msg.getCounters) {
  //   sendResponse({
  //     counter: counter++,
  //     persistentCounter: localStorage.counter++,
  //   });
  // }
});

function sendMessage(tabId: number, message: Message, responseCallback?: (response: any) => void): void {
  chrome.tabs.sendMessage(tabId, message, responseCallback);
}

chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
  if (tab.id) {
    if (info.selectionText) {
      sendMessage(tab.id, {
        selectionText: info.selectionText,
        type: "START_SUGGESTION",
      });
    }
  }
});

chrome.contextMenus.create({
  contexts: ["selection"],
  id: "start",
  title: "Suggest Edit",
});

chrome.alarms.onAlarm.addListener(() => {
  alert("Time's up!");
});

chrome.runtime.onSuspend.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (_tabs) => {
    // After the unload event listener runs, the page will unload, so any
    // asynchronous callbacks will not fire.
    // alert("Yet This does show up.");
  });
  console.log("Unloading.");
  chrome.browserAction.setBadgeText({ text: "" });
  // if (lastTabId) {
  //   chrome.tabs.sendMessage(lastTabId, "Background page unloaded.");
  // }
});
