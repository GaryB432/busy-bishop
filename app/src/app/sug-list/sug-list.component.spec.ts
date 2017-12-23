import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SugListComponent } from './sug-list.component';

describe('SugListComponent', () => {
  let component: SugListComponent;
  let fixture: ComponentFixture<SugListComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [SugListComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SugListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
