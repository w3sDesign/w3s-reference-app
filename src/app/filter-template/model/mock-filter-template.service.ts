// TODO
// CRUD

// analog mock-customer.service !?

import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { asyncData } from '../../../testing';

import { FilterTemplate } from './filter-template';
import { mockFilterTemplates } from './mock-filter-templates';

import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';


/**
 * ####################################################################
 * Mock FilterTemplate Service pretends to make real http requests.
 *
 * Based on angular/angular/aio/content/examples/testing
 * /src/app/model/testing/test-hero.service.ts
 * ####################################################################
 */
@Injectable()
// export class MockFilterTemplateService extends FilterTemplateService {
export class FilterTemplateService  {

  private filterTemplates: FilterTemplate[] = mockFilterTemplates;
  lastResult: Observable<any>;

  constructor() {
    // super();
  }



  getFilterTemplate(id: number): Observable<FilterTemplate> {
    return this.lastResult = asyncData(this.filterTemplates[id]);
  }


  getFilterTemplates(queryParams?: QueryParams): Observable<QueryResult> {
    const queryResult = new QueryResult();
    queryResult.items = this.filterTemplates;

    return this.lastResult = asyncData(queryResult);
  }


  searchFilterTemplates(term: string): Observable<FilterTemplate[]> {
    throw new Error('Search method not implemented');
  }


  createFilterTemplate(filterTemplate: FilterTemplate): Observable<FilterTemplate> {
    return this.lastResult = this.getFilterTemplate(filterTemplate.templateId)
      .pipe(
        map(res => {
          if (res) { return Object.assign(res, filterTemplate); }
          throw new Error(`FilterTemplate ${filterTemplate.templateId} not found`);
        })
      );
  }


  updateFilterTemplate(filterTemplate: FilterTemplate): Observable<FilterTemplate> {
    return this.lastResult = this.getFilterTemplate(filterTemplate.templateId)
      .pipe(
        map(res => {
          if (res) { return Object.assign(res, filterTemplate); }
          throw new Error(`FilterTemplate ${filterTemplate.templateId} not found`);
        })
      );
  }


  deleteFilterTemplate(id: number): Observable<{}> {
    return this.lastResult = this.getFilterTemplate(id)
      .pipe(
        map(res => {
          if (res) { return {}; }
          throw new Error(`FilterTemplate ${id} not found`);
        })
      );
  }


  deleteFilterTemplates(ids: number[] = []): Observable<any> {
    const message = ids.length > 1 ?
      `Seleted ${ids.length} filterTemplates deleted.` :
      `FilterTemplate ${ids[0]} deleted.`;

    for (let i = 0; i < ids.length; i++) {
      return this.deleteFilterTemplate(ids[i]);
    }
  }

}
