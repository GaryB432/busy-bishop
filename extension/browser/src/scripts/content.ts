import '../styles/content.scss';

import {
  // FakePopup,
  Logic,
  MessageBusChrome,
  StartSuggestionCommand,
  StartSuggestionResponse,
  SuggestionDocument,
} from './lib/logic';
import { lastPointer } from './lib/pointer';

async function waityWait(doc: SuggestionDocument): Promise<string> {
  console.log(doc);
  return new Promise<string>(resolve => {
    window.setTimeout(() => resolve('yay'), 2000);
  });
}

function setup() {
  const logic = new Logic(new MessageBusChrome());
  // const dialog = new FakePopup();
  chrome.runtime.onMessage.addListener(
    async (command: StartSuggestionCommand, _sender, sendResponse) => {
      sendResponse(<StartSuggestionResponse>{
        type: 'START_SUGGESTION_RESPONSE',
        command,
        status: 'WAITING',
      });
      try {
        const suggestion = await logic.getSuggestionFromUser(
          lastPointer,
          command,
          waityWait
        );
        if (suggestion.textNodeIndex > -1) {
          logic.sendMakeSuggestion(suggestion);
        }

        // console.log(hi, 'hi');

        // // const parent = elem.parentElement;
        // const suggestedText = await dialog.doRun(
        //   'a',
        //   command.selectionText,
        //   'c'
        // );
        // logic.createAndSendMakeCommand(elem, command, 'context', suggestedText);
      } finally {
      }
    }
  );
}
setup();
