import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { DataService } from './data.service';

describe('AppComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [RouterTestingModule, HttpClientTestingModule],
        providers: [DataService],
      });
      // TestBed.overrideModule(HttpClientTestingModule, { set: { entryComponents: [] } })
      TestBed.compileComponents();
    })
  );
  // it(
  //   'should create the app',
  //   async(() => {
  //     const fixture = TestBed.createComponent(AppComponent);
  //     const app = fixture.debugElement.componentInstance;
  //     expect(app).toBeTruthy();
  //   })
  // );
  // it(
  //   `should have as title 'bb'`,
  //   async(() => {
  //     const fixture = TestBed.createComponent(AppComponent);
  //     const app = fixture.debugElement.componentInstance;
  //     expect(app.title).toEqual('Busy Bishop');
  //   })
  // );
  // it(
  //   'should render title in a h1 tag',
  //   async(() => {
  //     const fixture = TestBed.createComponent(AppComponent);
  //     fixture.detectChanges();
  //     const compiled = fixture.debugElement.nativeElement;
  //     expect(compiled.querySelector('h1').textContent).toContain(
  //       'Welcome to Busy Bishop!'
  //     );
  //   })
  // );
});
