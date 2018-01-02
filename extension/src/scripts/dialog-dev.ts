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

export class NewDialog {
  private bg$: HTMLDivElement;
  private input$: HTMLInputElement;
  private submit$: HTMLButtonElement;
  private diffSpans$: NodeListOf<HTMLSpanElement>;
  private elementHost: ShadowRoot | Document;
  private gotText: (newText: string) => void;

  constructor() {
    this.elementHost = document;
    this.addListeners();
  }

  public async doRun(
    front: string,
    selected: string,
    back: string
  ): Promise<string> {
    return new Promise<string>(resolve => {
      const parts = [front, selected, back];
      parts.forEach((part, i) => (this.diffSpans$.item(i).textContent = part));
      this.gotText = resolve;
      this.setCurrentDialog(0);
      this.bg$.classList.remove('hidden');
      this.input$.value = selected;
      this.input$.focus();
      this.input$.setSelectionRange(0, selected.length);
    });
  }

  private setCurrentDialog(index: number) {
    const dialogs = this.elementHost.querySelectorAll('.track li')!;
    Array.from(dialogs).forEach(c => c.classList.remove('current'));
    dialogs.item(index).classList.add('current');
  }

  private addListeners(): void {
    this.bg$ = this.elementHost.querySelector('#bg')! as HTMLDivElement;
    this.input$ = this.elementHost.querySelector('#input')! as HTMLInputElement;
    this.submit$ = this.elementHost.querySelector(
      '#submit'
    )! as HTMLButtonElement;

    this.input$.addEventListener('keyup', e => {
      this.submit$.disabled = this.input$.value.length === 0;
      if (e.keyCode === 13 && this.input$.value.length > 0) {
        this.submitClicked();
      }
    });

    Array.from(this.elementHost.querySelectorAll('.track')).forEach(e =>
      e.addEventListener('click', dlg => (dlg.cancelBubble = true))
    );

    this.submit$.addEventListener('click', () => this.submitClicked());

    const closeBgs = this.elementHost.querySelectorAll('.close-bg');
    console.log(closeBgs);
    Array.from(closeBgs).forEach(e =>
      e.addEventListener('click', () => this.closeClicked())
    );
    this.diffSpans$ = this.elementHost.querySelectorAll('.context > span');
  }

  private closeClicked() {
    this.bg$.classList.add('hidden');
  }

  private submitClicked() {
    this.gotText(this.input$.value);
    this.setCurrentDialog(1);
  }
}

const nd = new NewDialog();
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
