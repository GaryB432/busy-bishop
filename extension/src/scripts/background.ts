import { Logic } from './lib/logic/logic';
import {
  MakeSuggestionCommand,
  MakeSuggestionResponse,
} from './lib/logic/models';

interface StorageData {
  id?: string;
}

let userData: StorageData = {};
const logic = new Logic();

chrome.contextMenus.create({
  contexts: ['selection'],
  id: 'start',
  title: 'Suggest Edit',
});
chrome.contextMenus.onClicked.addListener((info, _tab) => {
  if (info.selectionText && userData.id) {
    logic.onStartSuggestion(info.selectionText, userData.id);
  }
});
chrome.runtime.onMessage.addListener(
  (command: MakeSuggestionCommand, _sender, sendResponse) => {
    const response: MakeSuggestionResponse = {
      data: command.data,
      status: 'OK',
      type: 'MAKE_SUGGESTION_RESPONSE',
    };
    logic.onMakeSuggestion(command);
    sendResponse(response);
  }
);
chrome.storage.sync.get('id', (ud: StorageData) => {
  userData = ud;
  if (!userData.id) {
    userData.id = logic.newId();
    chrome.storage.sync.set(userData);
  }
  console.log(userData);
});
