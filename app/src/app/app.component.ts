import { Component } from '@angular/core';

import { SuggestionDocument } from '../imported/common/models';
import { DataService } from './data.service';

@Component({
  selector: 'bb-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent {
  public title = 'Busy Bishop';
  public suggestions: SuggestionDocument[];
  constructor(private ds: DataService) {
    this.ds.suggestions.subscribe(sugs => {
      this.suggestions = sugs;
    });
  }
}
