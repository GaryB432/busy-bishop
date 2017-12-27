import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
// import { map } from 'rxjs/operators';

import { SuggestionDocument, TempDataSource } from '../../../common';

@Injectable()
export class DataService {
  public suggestions: Observable<SuggestionDocument[]>;
  private _sugs: BehaviorSubject<SuggestionDocument[]>;
  private baseUrl: string;
  private dataStore: {
    suggestions: SuggestionDocument[];
  };

  constructor(private http: HttpClient) {
    this.baseUrl = 'http://56e05c3213da80110013eba3.mockapi.io/api';
    this.dataStore = { suggestions: [] };
    this._sugs = new BehaviorSubject([] as SuggestionDocument[]);
    this.suggestions = this._sugs.asObservable();
  }

  public ngOnInit(): void {
    console.log('data going');
  }

  public loadForHref(href: string): void {
    new TempDataSource().getSuggestionsFor(href).then(sugs => {
      this.dataStore.suggestions = sugs;
      const store = { ...this.dataStore };
      this._sugs.next(store.suggestions);
    });

    // this.http.get<MakeSuggestionMessage[]>(`${this.baseUrl}/todos`).subscribe(data => {
    //   this.dataStore.suggestions = data;
    //   /* tslint:disable-next-line */
    //   this._sugs.next(Object.assign({}, this.dataStore).suggestions);
    // }, error => console.log('Could not load todos.'));
  }

  public load(id: number | string) {
    this.http.get<SuggestionDocument>(`${this.baseUrl}/todos/${id}`).subscribe(
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
      error => console.log('Could not load todo.')
    );
  }

  public create(todo: SuggestionDocument) {
    this.http
      .post<SuggestionDocument>(`${this.baseUrl}/todos`, JSON.stringify(todo))
      .subscribe(
        data => {
          this.dataStore.suggestions.push(data);
          /* tslint:disable-next-line */
          this._sugs.next(Object.assign({}, this.dataStore).suggestions);
        },
        error => console.log('Could not create todo.')
      );
  }

  public update(todo: SuggestionDocument) {
    this.http
      .put<SuggestionDocument>(
        `${this.baseUrl}/todos/${todo.id}`,
        JSON.stringify(todo)
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
        error => console.log('Could not update todo.')
      );
  }

  public remove(todoId: string) {
    this.http.delete(`${this.baseUrl}/todos/${todoId}`).subscribe(
      response => {
        this.dataStore.suggestions.forEach((t, i) => {
          if (t.id === todoId) {
            this.dataStore.suggestions.splice(i, 1);
          }
        });

        /* tslint:disable-next-line */
        this._sugs.next(Object.assign({}, this.dataStore).suggestions);
      },
      error => console.log('Could not delete todo.')
    );
  }
}
