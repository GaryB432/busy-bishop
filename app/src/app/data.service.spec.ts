import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { DataService } from './data.service';

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService],
    });
  });

  it(
    'should be created',
    inject([DataService], (service: DataService) => {
      expect(service).toBeTruthy();
    })
  );
});

// describe('Quotes Component', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         QuoteComponent,
//         QuotesComponent,
//         TickerComponent,
//         NumberPipe,
//       ],
//       imports: [HttpClientTestingModule, MaterialModule],
//       providers: [
//         DefaultTickersService,
//         {
//           provide: AppInsightsService,
//           useClass: MockAppInsights,
//         },
//         {
//           provide: DefaultTickersService,
//           useClass: MockDefaultTickerService,
//         },
//       ],
//     });
//     TestBed.overrideComponent(QuotesComponent, {
//       set: {
//         template: '{{title}}',
//       },
//     });
//     TestBed.overrideModule(HttpClientTestingModule, {
//       set: { entryComponents: [QuoteComponent] },
//     });
//   });

//   it('should load', () => {
//     const fixture: ComponentFixture<QuotesComponent> = TestBed.createComponent(
//       QuotesComponent
//     );
//     const sut: QuotesComponent = fixture.componentInstance;

//     sut.ticker = TestBed.createComponent<TickerComponent>(
//       TickerComponent
//     ).componentInstance;

//     sut.title = 'some title';
//     fixture.detectChanges();
//     expect(fixture.nativeElement.textContent).toContain('some title');
//   });
// });
