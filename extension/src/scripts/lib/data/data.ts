import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { environment as rootEnv } from '../../../imported/environments/environment';
import { SuggestionDocument } from '../../../imported/models';
import { HttpClient } from '../http';

interface Environment {
  functionKeys: {
    writeSuggestion: string;
    getSuggestions: string;
  };
  mainDb: {
    connection: string;
    host: string;
    masterKey: string;
  };
}
const environment = rootEnv as Environment;

export interface DataService {
  suggestions: Observable<SuggestionDocument[]>;
  loadForHref(href: string): void;
  load(id: number | string): void;
  create(suggestion: SuggestionDocument): void;
  update(suggestion: SuggestionDocument): void;
  remove(suggestionId: string): void;
}

export class AzureDataService implements DataService {
  public suggestions: Observable<SuggestionDocument[]>;
  private _sugs: BehaviorSubject<SuggestionDocument[]>;
  private azureApi = 'https://bb-hosted-functions.azurewebsites.net/api';
  private demoUrl = 'http://000000000000000000000000.mockapi.io/api';
  private dataStore: {
    suggestions: SuggestionDocument[];
  };

  constructor(private http: HttpClient = new HttpClient()) {
    this.dataStore = { suggestions: [] };
    this._sugs = new BehaviorSubject([] as SuggestionDocument[]);
    this.suggestions = this._sugs.asObservable();
  }

  public loadForHref(href: string): void {
    const key = environment.functionKeys.getSuggestions;
    this.http
      .get<SuggestionDocument[]>(
        `${this.azureApi}/get-suggestions?code=${key}&href=${encodeURIComponent(
          href
        )}`
      )
      .subscribe(
        data => {
          this.dataStore.suggestions = data;
          const store = { ...this.dataStore };
          this._sugs.next(store.suggestions);
        },
        _error => console.log('Could not load suggestions.')
      );
  }

  public load(id: number | string): void {
    this.http
      .get<SuggestionDocument>(`${this.demoUrl}/suggestions/${id}`)
      .subscribe(
        data => {
          let notFound = true;

          this.dataStore.suggestions.forEach((item, index) => {
            if (item.id === data.id) {
              this.dataStore.suggestions[index] = data;
              notFound = false;
            }
          });

          if (notFound) {
            this.dataStore.suggestions.push(data);
          }

          /* tslint:disable-next-line */
          this._sugs.next(Object.assign({}, this.dataStore).suggestions);
        },
        _error => console.log('Could not load suggestion.')
      );
  }

  public create(suggestion: SuggestionDocument): void {
    const key = environment.functionKeys.writeSuggestion;
    this.http
      .post<SuggestionDocument>(
        `${this.azureApi}/write-suggestion?code=${key}`,
        JSON.stringify(suggestion)
      )
      .subscribe(
        data => {
          console.log(JSON.stringify(data, null, 2));
          this.dataStore.suggestions.push(data);
          const store = { ...this.dataStore };
          this._sugs.next(store.suggestions);
        },
        _error => console.log('Could not create suggestion.', _error)
      );
  }

  public update(suggestion: SuggestionDocument): void {
    this.http
      .put<SuggestionDocument>(
        `${this.demoUrl}/suggestions/${suggestion.id}`,
        JSON.stringify(suggestion)
      )
      .subscribe(
        data => {
          this.dataStore.suggestions.forEach((t, i) => {
            if (t.id === data.id) {
              this.dataStore.suggestions[i] = data;
            }
          });

          /* tslint:disable-next-line */
          this._sugs.next(Object.assign({}, this.dataStore).suggestions);
        },
        _error => console.log('Could not update suggestion.')
      );
  }

  public remove(suggestionId: string): void {
    this.http.delete(`${this.demoUrl}/suggestions/${suggestionId}`).subscribe(
      _response => {
        this.dataStore.suggestions.forEach((t, i) => {
          if (t.id === suggestionId) {
            this.dataStore.suggestions.splice(i, 1);
          }
        });

        /* tslint:disable-next-line */
        this._sugs.next(Object.assign({}, this.dataStore).suggestions);
      },
      _error => console.log('Could not delete suggestion.')
    );
  }
}
