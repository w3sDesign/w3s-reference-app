import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTemplateDetailComponent } from './filter-template-detail.component';

describe('FilterTemplateDetailComponent', () => {
  let component: FilterTemplateDetailComponent;
  let fixture: ComponentFixture<FilterTemplateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterTemplateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTemplateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
