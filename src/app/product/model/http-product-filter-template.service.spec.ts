import { TestBed } from '@angular/core/testing';

import { HttpProductFilterTemplateService } from './http-product-filter-template.service';

describe('HttpProductFilterTemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpProductFilterTemplateService = TestBed.get(HttpProductFilterTemplateService);
    expect(service).toBeTruthy();
  });
});
