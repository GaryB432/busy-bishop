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
  }

  public async doRun(defValue: string): Promise<string> {
    return new Promise<string>(resolve => {
      this.run(defValue, s => resolve(s));
    });
  }
}

