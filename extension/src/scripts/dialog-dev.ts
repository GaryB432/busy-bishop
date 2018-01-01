import { fromEvent } from 'rxjs/Observable/fromEvent';

import { Dialog } from './lib/dialog';

const dialog = new Dialog();
dialog.start(document.body, 'hi');
const btn = document.querySelector('#go')! as HTMLButtonElement;
fromEvent(btn, 'click').subscribe(() =>
  dialog
    .doRun(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      'cause it is pleasure',
      'sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia '
    )
    .then(t => console.log(t))
);
