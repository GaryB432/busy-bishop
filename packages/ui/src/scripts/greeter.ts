export class Greeter {
  public constructor(public greeting: string) {}
  public start(container: HTMLElement | null): void {
    const h1 = document.createElement('h1');
    if (!!container) {
      h1.textContent = `Welcome to ${this.greeting}!`;
      container.classList.add('greeter');
      container.appendChild(h1);
    }
  }
}
