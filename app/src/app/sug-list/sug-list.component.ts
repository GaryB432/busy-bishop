import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../data.service';
import { SuggestionDocument } from '../../imported/common/models';

@Component({
  selector: 'bb-sug-list',
  styleUrls: ['./sug-list.component.css'],
  templateUrl: './sug-list.component.html',
})
export class SugListComponent implements OnInit {
  public suggestions: Observable<SuggestionDocument[]>;
  constructor(private data: DataService) {}

  public ngOnInit(): void {
    this.suggestions = this.data.suggestions;
    this.data.loadForHref(
      'https://blog.jcoglan.com/2017/03/22/myers-diff-in-linear-space-theory/'
    );
  }
}
