import { Component } from '@angular/core';

import { MakeSuggestionMessage } from '../../../common/messages';
import { DataService } from './data.service';

@Component({
  selector: 'bb-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
})
export class AppComponent {
  public title = 'bb';
  public suggestions: MakeSuggestionMessage[];
  constructor(private ds: DataService) {
    this.ds.suggestions.subscribe(sugs => {
      this.suggestions = sugs;
    });
  }
}
