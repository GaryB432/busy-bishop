import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { setTimeout } from 'timers';

import { SuggestionDocument } from '../../../imported/models';
import { DataService } from './data';

const fakeUrlInfo = {
  hash: '',
  host: '',
  pathname: '',
  protocol: '',
  search: '',
};

const fakeData: SuggestionDocument[] = [
  {
    context:
      ', click the browser action button to see a list of the suggestions. Make any changes\n            you choose to your documents and publish them the normal way. Simple.\n          ',
    createdAt: 1514402425728,
    elementPath: 'BODY 1 DIV 0 DIV 0 MAIN 2 DIV 0 DIV 1 P 8',
    id: '7442ea64-5528-409e-80ce-d2fff8d9d6d6',
    location: 'garyb432.github.io/busy-bishop/',
    selectedText: 'browser',
    selectionStart: 12,
    submitter: '00000000-0000-0000-0000-000000000000',
    suggestedText: 'extension',
    textNodeIndex: 2,
    url: fakeUrlInfo,
  },
  {
    context:
      "\n            Select a small amount of text containing the mistake you'd like to correct. Its simple. Just select\n            ",
    createdAt: 1514402490477,
    elementPath: 'BODY 1 DIV 0 DIV 0 MAIN 2 DIV 0 DIV 1 P 4',
    id: 'ff15bfd5-af48-4f45-9221-90c583ba0b07',
    location: 'garyb432.github.io/busy-bishop/',
    selectedText: 'Its',
    selectionStart: 89,
    submitter: '00000000-0000-0000-0000-000000000000',
    suggestedText: "It's",
    textNodeIndex: 0,
    url: fakeUrlInfo,
  },
  {
    context:
      "\n            Select a small amount of text containing the mistake you'd like to correct. Its simple. Just select\n            ",
    createdAt: 1514402842233,
    elementPath: 'BODY 1 DIV 0 DIV 0 MAIN 2 DIV 0 DIV 1 P 4',
    id: '219ffdb3-3ea0-47c6-9b28-725a66f5a343',
    location: 'garyb432.github.io/busy-bishop/',
    selectedText: 'small',
    selectionStart: 22,
    submitter: '00000000-0000-0000-0000-000000000000',
    suggestedText: 'minute',
    textNodeIndex: 0,
    url: fakeUrlInfo,
  },
];

export class MockDataService implements DataService {
  public suggestions: Observable<SuggestionDocument[]>;
  private _sugs: BehaviorSubject<SuggestionDocument[]>;
  private dataStore: {
    suggestions: SuggestionDocument[];
  };

  constructor() {
    this.dataStore = { suggestions: [] };
    this._sugs = new BehaviorSubject([] as SuggestionDocument[]);
    this.suggestions = this._sugs.asObservable();
  }

  public loadForLocation(href: string): void {
    setTimeout(() => {
      this.dataStore.suggestions = fakeData.map((d: SuggestionDocument) => {
        return { ...d, href };
      });
      const store = { ...this.dataStore };
      this._sugs.next(store.suggestions);
    }, 500);
  }
  public load(_id: string | number): void {
    throw new Error('Method not implemented.');
  }
  public create(_suggestion: SuggestionDocument): void {
    throw new Error('Method not implemented.');
  }
  public update(_suggestion: SuggestionDocument): void {
    throw new Error('Method not implemented.');
  }
  public remove(_suggestionId: string): void {
    throw new Error('Method not implemented.');
  }
}
