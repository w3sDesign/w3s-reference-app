import { TestBed } from '@angular/core/testing';

import { CustomerFilterTemplateService } from './customer-filter-template.service';

describe('CustomerFilterTemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerFilterTemplateService = TestBed.get(CustomerFilterTemplateService);
    expect(service).toBeTruthy();
  });
});
