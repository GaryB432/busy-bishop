import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
// import { map } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { SuggestionDocument } from '../imported/common/models';

@Injectable()
export class DataService {
  public suggestions: Observable<SuggestionDocument[]>;
  private azureApi = 'https://bb-hosted-functions.azurewebsites.net/api';
  private subject: BehaviorSubject<SuggestionDocument[]>;
  private dataStore: { suggestions: SuggestionDocument[] } = {
    suggestions: [],
  };

  constructor(private http: HttpClient) {
    this.subject = new BehaviorSubject<SuggestionDocument[]>([]);
    this.suggestions = this.subject.asObservable();
  }

  public loadForLocation(location: string): void {
    const key = environment.functionKeys.getSuggestions;
    this.http
      .get<SuggestionDocument[]>(
        `${
          this.azureApi
        }/get-suggestions?code=${key}&location=${encodeURIComponent(location)}`
      )
      .subscribe(
        data => {
          this.subject.next((this.dataStore.suggestions = data));
        },
        () => this.subject.error('Could not load suggestions.')
      );
  }

  public load(id: number | string) {
    this.http.get<SuggestionDocument>(`${this.azureApi}/todos/${id}`).subscribe(
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
        this.subject.next(Object.assign({}, this.dataStore).suggestions);
      },
      error => console.log('Could not load todo.')
    );
  }

  public create(todo: SuggestionDocument) {
    this.http
      .post<SuggestionDocument>(`${this.azureApi}/todos`, JSON.stringify(todo))
      .subscribe(
        data => {
          this.dataStore.suggestions.push(data);
          /* tslint:disable-next-line */
          this.subject.next(Object.assign({}, this.dataStore).suggestions);
        },
        error => console.log('Could not create todo.')
      );
  }

  public update(todo: SuggestionDocument) {
    this.http
      .put<SuggestionDocument>(
        `${this.azureApi}/todos/${todo.id}`,
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
          this.subject.next(Object.assign({}, this.dataStore).suggestions);
        },
        error => console.log('Could not update todo.')
      );
  }

  public remove(todoId: string) {
    this.http.delete(`${this.azureApi}/todos/${todoId}`).subscribe(
      response => {
        this.dataStore.suggestions.forEach((t, i) => {
          if (t.id === todoId) {
            this.dataStore.suggestions.splice(i, 1);
          }
        });

        /* tslint:disable-next-line */
        this.subject.next(Object.assign({}, this.dataStore).suggestions);
      },
      error => console.log('Could not delete todo.')
    );
  }
}
