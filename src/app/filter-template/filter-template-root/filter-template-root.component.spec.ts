import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTemplateRootComponent } from './filter-template-root.component';

describe('FilterTemplateRootComponent', () => {
  let component: FilterTemplateRootComponent;
  let fixture: ComponentFixture<FilterTemplateRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterTemplateRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTemplateRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
