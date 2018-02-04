import { SuggestionDocument } from '../imported/models';
import { Dialog } from './lib/dialog';
import { Logic } from './lib/logic/logic';
import {
  StartSuggestionCommand,
  StartSuggestionResponse,
} from './lib/logic/models';
import { lastPointer } from './lib/pointer';

const dialog = new Dialog();
const logic = new Logic();
function setupChrome() {
  chrome.runtime.onMessage.addListener(
    async (command: StartSuggestionCommand, _sender, sendResponse) => {
      const earlyResponse: StartSuggestionResponse = {
        command,
        status: 'WAITING',
        type: 'START_SUGGESTION_RESPONSE',
      };
      sendResponse(earlyResponse);
      const runDialog = async (doc: SuggestionDocument) => {
        return dialog.doRun(
          doc.context.slice(0, doc.selectionStart),
          doc.selectedText,
          doc.context.slice(doc.selectedText.length + doc.selectionStart)
        );
      };
      const suggestion = await logic.getSuggestionFromUser(
        lastPointer,
        command,
        runDialog
      );
      if (suggestion.textNodeIndex > -1) {
        logic.sendMakeSuggestion(suggestion);
      }
    }
  );
}

if (chrome.runtime.onMessage) {
  setupChrome();
} else {
  console.log('local testing');
}
