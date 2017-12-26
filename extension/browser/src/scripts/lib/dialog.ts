export class Dialog {
  private background: HTMLElement;
  private okButton: HTMLButtonElement;
  private inputElement: HTMLInputElement;
  private diffSpans: NodeListOf<HTMLSpanElement>;
  private onOk: (value: string) => void;

  public start(parent: Element, placeHolder: string = ''): void {
    const bishop = document.createElement('div') as HTMLDivElement;
    bishop.classList.add('bishop');
    const root = bishop.attachShadow({ mode: 'closed' });
    root.innerHTML = this.getHtml(placeHolder);
    this.initElements(root);
    this.hide();
    parent.appendChild(bishop);
  }
  public run(
    front: string,
    selected: string,
    back: string,
    cb: (value: string) => void
  ): void {
    const parts = [front, selected, back];
    parts.forEach((part, i) => (this.diffSpans.item(i).textContent = part));
    this.onOk = cb;
    this.inputElement.value = selected;
    this.show();
    this.inputElement.focus();
    this.inputElement.setSelectionRange(0, selected.length);
  }

  public async doRun(
    front: string,
    selected: string,
    back: string
  ): Promise<string> {
    return new Promise<string>(resolve => {
      this.run(front, selected, back, s => resolve(s));
    });
  }

  private show(): void {
    this.okButton.disabled = !this.okEnabled();
    this.background.classList.remove('hidden');
  }

  private hide(): void {
    this.background.classList.add('hidden');
    this.okButton.disabled = !this.okEnabled();
  }

  private okEnabled(): boolean {
    return this.inputElement.value.length > 0;
  }

  private initElements(root: ShadowRoot) {
    this.background = root.querySelector('.bg')! as HTMLElement;
    this.okButton = root.querySelector('#ok')! as HTMLButtonElement;
    this.inputElement = root.querySelector('#input') as HTMLInputElement;
    const cancel = root.querySelector('#cancel') as HTMLButtonElement;
    const close = root.querySelector('.close') as HTMLButtonElement;
    this.diffSpans = root.querySelectorAll('.context > span');

    this.okButton.addEventListener('click', () => {
      this.onOk(this.inputElement.value);
      this.hide();
    });
    this.inputElement.addEventListener('keyup', () => {
      this.okButton.disabled = !this.okEnabled();
    });
    cancel.addEventListener('click', () => {
      this.hide();
    });
    close.addEventListener('click', () => {
      this.hide();
    });
    window.addEventListener('click', event => {
      if (event.target === this.background) {
        this.hide();
      }
    });
  }

  private getHtml(placeHolder: string): string {
    return `<style>
    .bg {
      font-family: verdana;
      background-color: rgba(0, 0, 0, 0.4);
      /* Black w/ opacity */
      position: fixed;
      display: flex;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      justify-content: center;
      align-items: center;
      z-index: 1;
      overflow: scroll;
    }
    .bg.hidden {
      display: none;
    }
    .dialog {
      background-color: white;
      padding: 14px;
      /* display: flex; */
      max-width: 30%;
      overflow: hidden;
      box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.5);
      /* box-shadow: 12px 12px 2px 1px rgba(0, 0, 255, 0.2); */
    }
    .top {
      border-bottom: thin solid silver;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .instructions {
      display: flex;
      align-content: flex-start;
      flex-direction: row;
    }
    .instructions img {
      height: 38px;
      width: 38px;
      flex-shrink: 0;
    }
    .instructions h1 {
      padding: 0;
      margin: 0;
    }
    .instructions section {
      margin: 0 10px;
    }
    .close {
      padding: 5px;
      cursor: pointer;
      font-size: 2rem;
    }
    .close:hover {
      background-color: silver;
    }
    .context {
      font-size: 0.8rem;
    }
    .context .strike {
      background-color: chartreuse;
      color: black;
    }

    /*
    .strike {
      color: blue;
      background-color: chartreuse;
   }
    .context {
      background-color: #cccccc;
      font-size: .8rem;
      margin: 5px;
      padding: 15px;
    }
   */
  </style>
  <div class="bg">
    <div class="dialog">
      <div class="top">
        <div>
          <img src="data:image/png;base64,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" />
        </div>
        <div class="instructions">
          <section>
            <h1>Enter your suggested change</h1>
            <p>and click OK</p>
          </section>
        </div>
        <div>
          <div class="close">&times;</div>
        </div>
      </div>
      <div class="bottom">
        <div class="context">
          <span></span>
          <span class="strike"></span>
          <span></span>
        </div>
        <input id="input" placeholder="Suggested Edit" size="15" value="${placeHolder}">
        <button id="ok">OK</button>
        <button id="cancel">Cancel</button>
      </div>
    </div>
  </div>
`;
  }
}
