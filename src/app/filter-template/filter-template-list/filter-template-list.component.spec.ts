import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTemplateListComponent } from './filter-template-list.component';

describe('FilterTemplateListComponent', () => {
  let component: FilterTemplateListComponent;
  let fixture: ComponentFixture<FilterTemplateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterTemplateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
