import { Logic, MakeSuggestionCommand, MessageBusChrome } from './lib/logic';
const logic = new Logic(new MessageBusChrome());

chrome.contextMenus.create({
  contexts: ['selection'],
  id: 'start',
  title: 'Suggest Edit',
});

function setup() {
  chrome.contextMenus.onClicked.addListener((info, _tab) => {
    console.log(info.menuItemId);
    if (info.selectionText) {
      logic.handleStartClick('xy,element', info.selectionText);
    }
  });
  chrome.runtime.onMessage.addListener(
    (command: MakeSuggestionCommand, _sender, sendResponse) => {
      sendResponse(logic.handleMakeCommand(command));
    }
  );
}

setup();
console.log('Loaded.');
