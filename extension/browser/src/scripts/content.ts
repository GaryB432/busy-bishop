import '../styles/content.scss';

import {
  FakePopup,
  Logic,
  MessageBusChrome,
  StartSuggestionCommand,
  StartSuggestionResponse,
} from './lib/logic';
import { lastPointer } from './lib/pointer';

async function waityWait(): Promise<string> {
  return new Promise<string>(resolve => {
    window.setTimeout(() => resolve('yay'), 2000);
  });
}

function setup() {
  const logic = new Logic(new MessageBusChrome());
  const dialog = new FakePopup();
  chrome.runtime.onMessage.addListener(
    async (command: StartSuggestionCommand, _sender, sendResponse) => {
      sendResponse(<StartSuggestionResponse>{
        type: 'START_SUGGESTION_RESPONSE',
        command,
        status: 'WAITING',
      });
      const elem = document.elementFromPoint(lastPointer.x, lastPointer.y);
      try {
        const hi = await logic.getSuggestionFromUser(elem, command, waityWait);

        console.log(hi, 'hi');

        // const parent = elem.parentElement;
        const suggestedText = await dialog.doRun(
          'a',
          command.selectionText,
          'c'
        );
        logic.createAndSendMakeCommand(elem, command, 'context', suggestedText);
      } finally {
      }
    }
  );
}
setup();
