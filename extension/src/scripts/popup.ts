import '../styles/popup.scss';

import { SuggestionDocument } from '../imported/models';
import { Logic } from './lib/logic/logic';
import * as utilities from './lib/utilities';

const suggestions$ = document.querySelector('#suggestions')!;
const url$ = document.querySelector('#url')!;

const ltrim = (str: string) => str.replace(/^\s+/, '');
const rtrim = (str: string) => str.replace(/\s+$/, '');

const logic = new Logic();
let contentReady = false;

function importTemplate(templateId: string): DocumentFragment {
  const template$ = document.querySelector(templateId) as HTMLTemplateElement;
  if (!template$) {
    throw new Error('sorry');
  }
  return document.importNode(template$.content, true);
}

function createDiffElement(
  start: string,
  strike: string,
  ins: string,
  end: string
): DocumentFragment {
  const div$ = importTemplate('#diffTemplate');
  const spans: NodeListOf<HTMLSpanElement> = div$.querySelectorAll(
    'div.diff > span'
  );
  spans[0].innerHTML = `&hellip;${ltrim(start)}`;
  spans[1].innerHTML = strike;
  spans[2].innerHTML = ins;
  spans[3].innerHTML = `${rtrim(end)}&hellip;`;
  return div$;
}
function addSuggestionElement(suggestion: SuggestionDocument) {
  const sug$ = importTemplate('#suggTemplate');
  const diffs$ = sug$.querySelector('.diffc')!;
  const position = utilities.narrowSelectionContext(
    suggestion.context,
    suggestion.selectedText
  );
  if (!!position) {
    const { line, index } = position;
    const selectionLength = suggestion.selectedText.length;
    const start = line.slice(0, index);
    const strike = line.slice(index, index + selectionLength);
    const ins = suggestion.suggestedText!;
    const end = line.slice(index + selectionLength);
    diffs$.appendChild(createDiffElement(start, strike, ins, end));
  } else {
    const d = document.createElement('span');
    d.innerText = suggestion.id;
    diffs$.appendChild(d);
  }
  const info$ = sug$.querySelector('.info')!;
  const ds = utilities.dateString(suggestion.createdAt);
  const html = `<p>${ds}</p>`;
  info$.innerHTML = html;

  suggestions$.appendChild(sug$);
}

function processUrl(url?: string): void {
  if (!!url) {
    url$.textContent = utilities.cleanLocation(url);
    const content$ = document.querySelector('.content')!;
    logic.suggestions.subscribe(
      suggestions => {
        for (const s of suggestions) {
          addSuggestionElement(s);
        }
        if (contentReady || suggestions.length) {
          const cs = ['ready'];
          if (suggestions.length === 0) {
            cs.push('none');
          }
          content$.classList.add(...cs);
        }
        contentReady = true;
      },
      err => {
        alert(err);
        content$.classList.add('ready', 'none');
      }
    );
    logic.onPopupLoaded(url);
  }
}

if (chrome.tabs) {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    (tabs: chrome.tabs.Tab[]) => processUrl(tabs[0].url)
  );
} else {
  processUrl(
    'https://blog.jcoglan.com/2017/03/22/myers-diff-in-linear-space-theory/'
  );
}
