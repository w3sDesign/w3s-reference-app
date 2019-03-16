import { TestBed } from '@angular/core/testing';

import { FilterTemplateService } from './filter-template.service';

describe('FilterTemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterTemplateService = TestBed.get(FilterTemplateService);
    expect(service).toBeTruthy();
  });
});
