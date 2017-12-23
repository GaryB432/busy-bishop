import '../styles/popup.scss';
import * as data from './lib/data';
import * as messages from './lib/messages';
import * as utilities from './lib/utilities';

// const elem = document.querySelector('#suggestions');

const schemeRegex: RegExp = new RegExp('https*://', 'ig');
const ltrim = (str: string) => str.replace(/^\s+/, '');
const rtrim = (str: string) => str.replace(/\s+$/, '');
const schemeTrim = (str: string) => str.replace(schemeRegex, '');

function asdf(templateId: string): DocumentFragment {
  const template$ = document.querySelector(
    templateId
  ) as HTMLTemplateElement;
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
  const div$ = asdf('#diffTemplate');
  const spans: NodeListOf<HTMLSpanElement> = div$.querySelectorAll(
    'div.diff > span'
  );
  spans[0].innerHTML = `&hellip;${ltrim(start)}`;
  spans[1].innerHTML = strike;
  spans[2].innerHTML = ins;
  spans[3].innerHTML = `${rtrim(end)}&hellip;`;
  return div$;
}
function addSuggestionElement(suggestion: messages.MakeSuggestionMessage, sugs$: HTMLDivElement) {
  const flx = utilities.narrowSelectionContext(suggestion.context, suggestion.selectedText);
  if (!!flx) {
    const { line, index } = flx;
    const selectionLength = suggestion.selectedText.length;
    const start = line.slice(0, index);
    const strike = line.slice(index, index + selectionLength);
    const ins = suggestion.suggestedText!;
    const end = line.slice(index + selectionLength);
    sugs$.appendChild(createDiffElement(start, strike, ins, end));
  }
}

async function processUrl(url?: string): Promise<boolean> {
  // const sugs$ = document.createElement('div');
  const sugs$ = document.querySelector<HTMLDivElement>('#suggestions')!;
  if (!!url) {
    const url$ = document.querySelector('#url');
    url$!.textContent = schemeTrim(url);
    const suggestions = await data.getSuggestionsForHref(url);
    for (const s of suggestions) {
      addSuggestionElement(s, sugs$);
    }
  }
  // elem!.appendChild(sugs$);
  return true;
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

