import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { environment as rootEnv } from '../../../imported/common/imported/environments/environment';
import { SuggestionDocument } from '../../../imported/common/models';
import { HttpClient } from './http';

interface Environment {
  functionKeys: {
    writeSuggestion: string;
  };
  mainDb: {
    connection: string;
    host: string;
    masterKey: string;
  };
}
const environment = rootEnv as Environment;

export class DataService {
  public suggestions: Observable<SuggestionDocument[]>;
  private _sugs: BehaviorSubject<SuggestionDocument[]>;
  private azureApi = 'https://bb-hosted-functions.azurewebsites.net/api';
  private demoUrl = 'http://5a441e2c342c490012f3fd0a.mockapi.io/api';
  private dataStore: {
    suggestions: SuggestionDocument[];
  };

  constructor(private http: HttpClient = new HttpClient()) {
    this.dataStore = { suggestions: [] };
    this._sugs = new BehaviorSubject([] as SuggestionDocument[]);
    this.suggestions = this._sugs.asObservable();
  }

  public loadForHref(href: string): void {
    this.http
      .get<SuggestionDocument[]>(`${this.demoUrl}/suggestions?href=${href}`)
      .subscribe(
        data => {
          this.dataStore.suggestions = data;
          const store = { ...this.dataStore };
          this._sugs.next(store.suggestions);
        },
        _error => console.log('Could not load suggestions.')
      );
  }

  public load(id: number | string) {
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

  public create(suggestion: SuggestionDocument) {
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

  public update(suggestion: SuggestionDocument) {
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

  public remove(suggestionId: string) {
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
