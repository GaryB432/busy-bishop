import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

// import * as data from '../../../../common/data';

import { DataService } from '../data.service';
import { SuggestionDocument } from '../../../../common';

@Component({
  selector: 'bb-sug-list',
  styleUrls: ['./sug-list.component.css'],
  templateUrl: './sug-list.component.html',
})
export class SugListComponent implements OnInit {
  public suggestions: Observable<SuggestionDocument[]>;
  constructor(private http: HttpClient, private data: DataService) {}

  public ngOnInit(): void {
    this.http
      .get<SuggestionDocument[]>('https://api.github.com/users/seeschweiler')
      .subscribe(data => {
        console.log(data);
      });

    this.suggestions = this.data.suggestions;
    this.data.loadForHref(
      'https://blog.jcoglan.com/2017/03/22/myers-diff-in-linear-space-theory/'
    );
  }
}
