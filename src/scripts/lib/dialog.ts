export class Dialog {
  public start(_parent: Element, placeHolder: string = ''): void {
    const html = `
<div class="modal hidden">
<div class="content">
  <span class="close">×</span>
  <div class="user">override me soon</div>
  <input placeholder="${placeHolder}">
  <button class="">OK</button>
  <button class="">Cancel</button>
</div>
</div>`;
    console.log(`starting ${placeHolder}`, html.length);
  }
  public run(defValue: string, cb: (value: string) => void): void {
    console.log(`running ${defValue}`);
    if (confirm(`confirm ${defValue}`)) {
      cb(`changed ${defValue}`);
    }
    // this.inputElement.value = defValue;
    // this.inputElement.setSelectionRange(0, this.inputElement.value.length);
    // this.onOk = cb;
    // this.show();
    // this.inputElement.focus();
  }

  public async doRun(defValue: string): Promise<string> {
    return new Promise<string>(resolve => {
      this.run(defValue, s => resolve(s));
    });
  }
}

// export class Dialog {
//   private userControl: HTMLDivElement;
//   private element: HTMLDivElement;
//   private inputElement: HTMLInputElement;
//   private okButton: HTMLButtonElement;
//   private onOk: (value: string) => void;

//   public start(parent: Element, placeHolder: string = ''): void {
//     this.element = this.createDiv('modal', 'hidden');
//     const container = this.createDiv('content');
//     this.initDialogElement(container);
//     this.element.appendChild(container);
//     this.inputElement.placeholder = placeHolder;
//     parent.appendChild(this.element);
//     this.okButton.onclick = () => {
//       this.onOk(this.inputElement.value);
//       this.hide();
//     };

//     window.addEventListener('click', event => {
//       if (event.target === this.element) {
//         this.hide();
//       }
//     });
//   }

//   public show() {
//     this.okButton.disabled = !this.okEnabled();
//     this.element.classList.remove('hidden');
//   }

//   public hide() {
//     this.element.classList.add('hidden');
//     this.okButton.disabled = !this.okEnabled();
//   }

//   public run(defValue: string, cb: (value: string) => void): void {
//     this.inputElement.value = defValue;
//     this.inputElement.setSelectionRange(0, this.inputElement.value.length);
//     this.onOk = cb;
//     this.show();
//     this.inputElement.focus();
//   }

//   public async doRun(defValue: string): Promise<string> {
//     return new Promise<string>(resolve => {
//       this.run(defValue, s => resolve(s));
//     });
//   }

//   protected initUserControl(user: HTMLDivElement): void {
//     user.appendChild(document.createTextNode('override me soon'));
//   }

//   private initDialogElement(dialog: HTMLElement): void {
//     dialog
//       .appendChild(this.addCloseElement())
//       .addEventListener('click', this.hide.bind(this));
//     dialog.appendChild((this.userControl = this.createDiv('user')));
//     dialog.appendChild((this.inputElement = document.createElement('input')));
//     dialog.appendChild((this.okButton = this.addButton('OK')));
//     dialog
//       .appendChild(this.addButton('Cancel'))
//       .addEventListener('click', this.hide.bind(this));
//     dialog.addEventListener('keyup', () => {
//       this.okButton.disabled = !this.okEnabled();
//     });
//     this.initUserControl(this.userControl);
//   }

//   private addCloseElement(): HTMLSpanElement {
//     const element = document.createElement('span');
//     element.classList.add('close');
//     element.innerHTML = '&times;';
//     return element;
//   }

//   private createDiv(...token: string[]): HTMLDivElement {
//     const div = document.createElement('div');
//     div.classList.add(...token);
//     return div;
//   }

//   private addButton(
//     textContent: string,
//     ...token: string[]
//   ): HTMLButtonElement {
//     const btn = document.createElement('button');
//     btn.textContent = textContent;
//     btn.classList.add(...token);
//     return btn;
//   }

//   private okEnabled(): boolean {
//     return this.inputElement.value.length > 0;
//   }
// }