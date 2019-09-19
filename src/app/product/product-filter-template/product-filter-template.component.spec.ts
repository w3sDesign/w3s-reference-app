import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFilterTemplateComponent } from './product-filter-template.component';

describe('ProductFilterTemplateComponent', () => {
  let component: ProductFilterTemplateComponent;
  let fixture: ComponentFixture<ProductFilterTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductFilterTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFilterTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
