export class Dialog {
  private bg$?: HTMLDivElement;
  private input$?: HTMLInputElement;
  private submit$?: HTMLButtonElement;
  private diffSpans$?: NodeListOf<HTMLSpanElement>;
  private elementHost: ShadowRoot | Document;
  private gotText?: (newText: string) => void;
  private dialogs?: HTMLLIElement[];

  constructor(elementHost?: ShadowRoot | Document) {
    if (!elementHost) {
      const bishop = document.createElement('div');
      const root = bishop.attachShadow({ mode: 'closed' });
      root.innerHTML = this.getHtml('');
      this.elementHost = root;
      document.documentElement.appendChild(bishop);
    } else {
      this.elementHost = elementHost;
    }
    this.addListeners();
  }

  public async doRun(
    front: string,
    selected: string,
    back: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const timo = setTimeout(() => {
        reject('dialog timeout');
      }, 30000);
      if (this.diffSpans$ && this.bg$ && this.input$) {
        const parts = [front, selected, back];
        parts.forEach((part, i) => {
          if (this.diffSpans$) {
            this.diffSpans$.item(i).textContent = part;
          }
        });
        this.gotText = suggText => {
          resolve(suggText);
          clearTimeout(timo);
        };
        this.setCurrentDialog(0);
        this.bg$.classList.remove('hidden');
        this.input$.value = selected;
        this.input$.focus();
        this.input$.setSelectionRange(0, selected.length);
      }
    });
  }

  protected getHtml(placeHolder: string): string {
    return `<style>
  #bg {
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    z-index: 1;
    overflow: scroll; }
    #bg.hidden {
      display: none; }
  
  .top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: thin solid silver;
    padding: 0.5em 0; }
    .top .left {
      display: inline-flex; }
      .top .left img {
        height: 38px;
        width: 38px; }
    .top .instructions {
      margin: 0 0.5em; }
      .top .instructions h1,
      .top .instructions h2 {
        padding: 0;
        margin: 0; }
      .top .instructions h1 {
        font-size: 1.5em; }
      .top .instructions h2 {
        font-size: 1.3em; }
  
  .bottom h3 {
    font-size: 1.1em; }
  
  button.close-bg {
    padding: 5px;
    cursor: pointer;
    font-size: 2em;
    border: thin solid silver;
    background: none;
    box-shadow: none;
    border-radius: 0px; }
    button.close-bg:hover {
      background-color: silver; }
  
  .context {
    background-color: antiquewhite;
    padding: 0.3em;
    margin: 0.3em;
    color: black; }
    .context .strike {
      background-color: chartreuse; }
  
  .track {
    width: 450px;
    position: relative;
    font: 13px Arial, Helvetica, sans-serif;
    overflow: hidden; }
  
  .content {
    margin: 0;
    padding: 0; }
  
  .content li {
    margin: 0;
    padding: 0;
    width: 100%;
    background-color: white;
    color: black;
    list-style: none;
    padding: 1em;
    max-width: 400px;
    box-shadow: 1em 1em 1em rgba(0, 0, 255, 0.2); }
  
  .active {
    height: 300px; }
  
  .active li {
    position: absolute;
    top: 310px;
    opacity: 0;
    transform: scale(0.5);
    transition: 1s; }
  
  .active li.current {
    top: 30px;
    opacity: 1;
    transform: scale(1);
    transition: 1s; }
  </style>
  <div id="bg" class="hidden close-bg">
  <div class="track active">
    <ol class="content">
      <li>
        <div class="top">
          <section class="left">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABIAAAASABGyWs+AAAAB3RJTUUH4QwQFzQ4DmQmhQAACyRJREFUWMO1mHlwVdd9xz/33rfdt+gt2t6T9ACB4CGBXLG4YCzHxiMn4ybBdhx7MJ5Oh3E7jN16mI4DNAF1MDUG03T6R9MpBjceNzE4YFoS9rhSa+pik2AHB5AACUkIC0kWelreorfce07/eBJIWGbJ0DNz5s685Xc+5/tbzu9cjXszVEADlHtk7w8ypAC2SCSSV1dXVzh//vx8j8eTb5qmR0ohFEUd7O3tvfbpp59+efTo0f6+vr4kYALy/wtMmz17tm/VqlVzH1i8+KFwWdlib17eDIfDnq+omi7BkjMoM6ZhxkdSIz0Dg0NNl9raPjly5MjH27dvb4nH4wlA3Cswtby83Ltp06YltQ8+uCIUDC612O3FfWlTbY2luDSconskw4ghUBXw2iyUuWxUeHTKPXbyNCWbiMfbOzo7Dx84cGDPhg0bfi+ESN5OwduBWV955ZXKlStXrppZUfGMabEWftIXZ//lfn7bH2cgbSABi6qgKRNN2VSFUqeN2qI8/iTsJ5LnkCPx+KXTn3/+9tatW39+6NChrlEX3xWYAug7duxY+tSTT64PFBQsOnktof6kuZuT12JYVRWfTcOuqahfY0AAWSFJmQKXpvJYiY8/qyiizKGlOzs7D765Y8cbW7du/RzITBo3X2PX9d577z3x1FNPbrN5fPf98/ke5W9/10lPKkNQt+G1alhU5ZZyK4CKgkNTAYVzQ0mOdQ1S7LRb5oeDVfdVV8/x+/0XGxsbuydTbjIw+zvvvPPtJ5Yte8OwO6dv+KyTt1v7KHRYCdgtKMqd5YvIGjhSIxjpDGgaDqtGWyzN+x39FNitLA4XhSsjkdlOp/P3H374YQ83JcXNYNqWLVsWrnjuub9XXZ7IDz/tZP+VAaa57eiaesf5bmYNPPFhni9QCVskHYMpMqpGRlG5HE/zP73DhJw2HggXlc2cMSN4tbv7k3Pnzg0xLiHGgym1tbWh+vr6jUXB0KP/0HSVd9v7mOZ2YFOVO4aSQiCGYix1mjxS4mFusY+qfDdXhlO0pUwGDcGIKfjttTg1+W5qSgrLp02bNrJz585TQHoCWDAYJB6P23bu3Ll8fk3NXzX0xqybTn9ByGm7K6WQYCaSPKSbVDk1UkKhvKSYynCI1miChi/jjKCAohDLmrTFUjxelq9NKQyUl5WVnTp06NDlMdVUgJ6eHmX58uXhefNq/nRYKM5/PNeNw6ListwFFJBNpZlFhseLHVQVe/C4nDT3DHPs4lX2d/QxPN6YonCiL86/tvTidLnK6urqVrjdbu/Y12PZbnn++eeXFgQC8452DXBmMEmhw3JXUGbWwJ9K8kTQjl+34fP7WVI9C3eem5+c7uC8qWHclMdSSn52qY9LsTTh0tK6119/vYrREqZKKQkEAnlz58z5VhpV39vRj8eqYbnD7MvFlURLJPhOgZXpeXbyvF6CwSBpAf/R2sPptMKgSS7vhARzdApoHRjhcGcUh1MvXbJkycOAFUBVFIUXX3yxtKiwoKY1lubMQBK/Tbu9WnJ0CjDiSZboksWFOm6Ph+JgEIvFwu7T7fy0tZ9eU0UaY0CMTgmGRGYFxzoHSJlSCQWDD1ZWVvqklKiAWlNTM1PX9dDv+uOkTIFdU28sLCdC3DyzyTQVIs23y9x43C6Ki4PY7XYaW3vY9Jt2uoUFOQ6EMUCD66qd7UvQlcjgzcubuWzZsmJFUVABS2lp6XRF1ZzNA0lsKCg3A4ztUozbrQAzncWbjPN02E2xx0lhURG6U6etP8aPGpvpNCy5MDblxDlBPUlfIkPHUAqHw54fiURKAMUCKPmBQKEA5Wosgx1ltHuSX3HdWNQJKckaJnJomO+GHVQWuPDn5+PxeEiks7zW2MRvBg1w6qOHjbxROsc/Ze7zVNakaziNVurRi4qK/JDroRRd13VDQixtoMnRAB0DG8eXNAQDKYPBtEFyKMazRRrfKPOS5/Xi8/mQUvLWyVZ2tURBd43b4Dhbo0BOq0aJx84Uj4MSl42peQ5MITJWqzU9Bsb1A1CAMib3OMWEkFxNZOiK5/ouUhkW6SYvzA3h93rwBwKoqkrDhau8caKDtMWRc/v4zUmJRVGI5Os8Pj2fuql+KvOd5OsWdIuGMI3UuaamtzZv3vy/Y2Ayk8lkLAq4NRUx5v9Rg0JCx1CKL2JphARMkzKZZs2CEqYV5OHz+7FarVzuj1H/62a6DQvY1FwcjZpRpCSS72TVvBKejhRS5rEzvhoZhpFqbm7evnr16h8fP368D5AWQA4ODkZVBUp0GyezAuw3YiqazNA1lEaI3CpacoTHwnbKfS58fj+6rpPMGGw+dpaP+zLg0HNQox5wWBSWzw3yN0umEMl3frUwm2a6ubl5+8svv7xttMuQY4qZvb29lxEiVRlwOvZkBXJUMVNIeoczmFmRK8jZLIt9GgsL7Zy+MoDd7WWqauPfTrbxs7PXwOG6EewCfA4LP3poKi/dX4rLqk0K1dLSsmPNmjUToMjlMubFixcvpjOZ/poiNw4UjKxAMSXZrCCeMnKLGRLSWb4R1Hk0UoTbYee/znay6+MWtv33JVKaA4RyvVZ5rRpbHp3OXy8O3wpq59q1a7ceO3ZsAhSMHknvvvtuZzQ60DQzoFMZcOZgBJiGyKk1mhA206SiwE35lDKefeSP8Hjz2NzYxuWUBdCu/84uFX5YO5U/X1CCRf3q0SaEyLS2tr61Zs2aLQcOHOhmkouJqigKp06dira1tzfqmmI+OauAeNLIuXNMKUNCVpCnKlRPLSaakmz65Wk2HG2lM2MD1XKjcGYFz84p4i8Xl00KZZpmtq2t7e2NGzduOXjw4KRQcKNRFOFwOLFgwYKlM4q8BcfbBogmDKyKypexDIYhwBSEdIVip436X51l99koQ9hA1SYcVzMDOv/0VIQyr2NSqObm5p+vX7/+7/bu3dvFLa5wGsBnn33GihUrhp/+/vcDM8KltT6HVT3cfA3dojKQzJJKmyAVEmlBY8sAnQmQVnsuRMegpEQR8INHpvK96uLJ3Gc0NTX9YvXq1a8fOXLkMre5+GoAb775JoBht9t7F95//4K54YJwNJ7l1JUhFAHDI0auO5UqJhqo6sSzVAKmZFaBky3fmYXfab1ZKePChQu/WLt27WsffPBBG7e4T97sSkKhEA0NDUPz588fmFkx46GFUwPu1i+TNHfHSaTMG5V8PMz4pylZsSDEcwtDE4qnEMI4f/78nnXr1r12+PDhS+T6ituO62DxeBzA3LdvX1dd3WPGjGnhRQ9MD9ivDqQ4cyWGaQqQykTAce2Qw6Ky7pvlzA66xkOZLS0t+9atW7fp4MGDrXcKNQFs3MicOHHifG1trZhWGpz3aKTA7rRqnLkSI5E0RqGUieqZUOpz8INvlRNwWa9Dtba27tuwYcOr+/fvvyuorwMjGo2OHD9+/Ex1dfXwlNJQ9cORQs+ich+DiSxf9KfIXHftjfiqLvHwFw+HsVvV61D19fUb9+7d23K3UF8LBtDf3z+ya9eusxUVFedDoWDJnHB+yXdrirVF5V4cFpWRtMlIWmCM1rk/nuFjxQMlKEjR0dGx/9VXX924e/fuPwjqTodt5cqVkY8++qg+Gu0/I0wzY5hCXomOyP88d03+S+NluX7vBfneJ1elaZpmW1vb+ytXrqy61abv5VAA10svvXRfQ0PDy52dnfsT8dgl08jGpRSmlFIKIcz29vZ/f+GFFyrvBdTdvupUAGtVVVXeM888U1pdXT09FApNcTgcxVLK1J49e97ftm3bBe6gTt1rsMn+r5G7C0py77ru6FXm7cb/AQfFcRpiMX7xAAAAOXRFWHRjb21tZW50AFBlbmNpbCBibHVlIGZyb20gSWNvbiBHYWxsZXJ5IGh0dHA6Ly9pY29uZ2FsLmNvbS9kJ/OYAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTEyLTE2VDIzOjUyOjU2LTA1OjAwOfUC8gAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMi0xNlQyMzo1Mjo1Ni0wNTowMEiouk4AAAAASUVORK5CYII="
              alt="logo">
            <section class="instructions">
              <h2>Enter your suggested change</h2>
            </section>
          </section>
          <button class="close-bg">&times;</button>
        </div>
        <div class="bottom">
          <div class="context">
            <span></span>
            <span class="strike"></span>
            <span></span>
          </div>
          <input id="input" type="text" maxlength="20" autocomplete="off" autofocus="true" placeholder="Suggested Edit" required="true"
            spellcheck="false" value="${placeHolder}">
          <button id="submit">Suggest</button>
        </div>
      </li>
      <li>
        <div class="top">
          <section class="left">
            <section class="instructions">
              <h2>Thanks</h2>
            </section>
          </section>
          <button class="close-bg">&times;</button>
        </div>
        <div class="bottom">
          <h3>for your contribution!</h3>
          <p>Please
            <a href="https://garyb432.github.io/busy-bishop/feedback.html" target="new">send feedback</a>.</p>
        </div>
      </li>
      <li class="current">
        placeholder
      </li>
    </ol>
  </div>
</div>
`;
  }

  private setCurrentDialog(index: number): void {
    if (this.dialogs) {
      this.dialogs.forEach(c => c.classList.remove('current'));
      this.dialogs[index].classList.add('current');
    }
  }

  private addListeners(): void {
    this.bg$ = this.elementHost.querySelector('#bg') as HTMLDivElement;
    this.input$ = this.elementHost.querySelector('#input') as HTMLInputElement;
    this.submit$ = this.elementHost.querySelector(
      '#submit'
    )! as HTMLButtonElement;

    this.input$.addEventListener('keyup', e => {
      if (!!this.submit$ && !!this.input$) {
        this.submit$.disabled = this.input$.value.length === 0;
        if (e.keyCode === 13 && this.input$.value.length > 0) {
          this.submitClicked();
        }
      }
    });

    Array.from(this.elementHost.querySelectorAll('.track')).forEach(e =>
      e.addEventListener('click', dlg => (dlg.cancelBubble = true))
    );

    this.submit$.addEventListener('click', () => this.submitClicked());

    const closeBgs = this.elementHost.querySelectorAll('.close-bg');
    Array.from(closeBgs).forEach(e =>
      e.addEventListener('click', () => this.closeClicked())
    );
    this.diffSpans$ = this.elementHost.querySelectorAll('.context > span');

    this.dialogs = Array.from(this.elementHost.querySelectorAll('.track li'));
    if (this.dialogs) {
      this.dialogs.forEach((dlg, i) =>
        dlg.addEventListener('transitionend', e => {
          const te = e as TransitionEvent;
          if (te.propertyName === 'transform' && i === 1) {
            dlg.querySelector('button')!.focus();
          }
        })
      );
    }
  }

  private closeClicked() {
    if (this.bg$) {
      this.bg$.classList.add('hidden');
    }
  }

  private submitClicked() {
    if (this.gotText && this.input$) {
      this.gotText(this.input$.value);
      this.setCurrentDialog(1);
    }
  }
}
