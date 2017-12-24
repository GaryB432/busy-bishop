export class Dialog {
  private background: HTMLElement;
  private okButton: HTMLButtonElement;
  private inputElement: HTMLInputElement;
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
  public run(defValue: string, cb: (value: string) => void): void {
    this.onOk = cb;
    this.inputElement.value = defValue;
    this.show();
    this.inputElement.focus();
    this.inputElement.setSelectionRange(0, defValue.length);
  }

  public async doRun(defValue: string): Promise<string> {
    return new Promise<string>(resolve => {
      this.run(defValue, s => resolve(s));
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
          <img src="../images/icon-38.png" />
        </div>
        <div class="instructions">
          <section>
            <h1>Enter your suggested change</h1>
            <p>Now is the time for all good men to come to the aid of their country. Now is the time for all good men to come
              to the aid of their country. Now is the time for all good men to come to the aid of their country</p>
            <p>Now is the time for all good men to come to the aid of their country. Now is the time for all good men to come
              to the aid of their country. Now is the time for all good men to come to the aid of their country</p>
          </section>
        </div>
        <div>
          <div class="close">&times;</div>
        </div>
      </div>
      <div class="bottom">
        <div class="context">
          <span>...now is the time for all good </span>
          <span class="strike">men</span>
          <span> to come to the aid of their country Now is the time for all good men to come to the aid of their country. Now is the time for all good men to come to the aid
              of their country. Now is the time for all good men to come to the aid of their country...</span>
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
