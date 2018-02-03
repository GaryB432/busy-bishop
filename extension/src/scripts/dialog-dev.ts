import { Dialog } from '../scripts/lib/dialog';
import '../styles/dialog-dev.scss';

const zoomOne = document.querySelector('.zoomPic')! as HTMLElement;

document.querySelector('.zoom')!.addEventListener('click', _ => {
  if (!zoomOne.classList.contains('zoom')) {
    zoomOne.classList.add('zoom');
  }
});

document.querySelector('.zoomout')!.addEventListener('click', _ => {
  zoomOne.classList.remove('zoom');
});

class NewDialog extends Dialog {
  protected getHtml(_placeHolder: string): string {
    throw new Error('do not use shadow dom in dev');
  }
}
const nd = new NewDialog(document);
const btn = document.querySelector('#go')! as HTMLButtonElement;
btn.addEventListener('click', () => {
  nd
    .doRun(
      'inventore veritatis et quasi architecto beatae',
      'dolorem ipsum',
      'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis'
    )
    .then(newInput => console.log(newInput));
});
