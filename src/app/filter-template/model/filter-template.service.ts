import { FilterTemplate } from './filter-template';
import { Observable } from 'rxjs';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';

/**
 * FilterTemplate data access service - Interface
 */
export abstract class FilterTemplateService {
  filterTemplatesUrl = 'api/filter-templates';  // URL to web api

  abstract getFilterTemplate(id: number): Observable<FilterTemplate>;

  // abstract getFilterTemplates (queryParams?: QueryParams): Observable<FilterTemplate[] | QueryResult>;
  abstract getFilterTemplates (queryParams?: QueryParams): Observable<QueryResult>;

  abstract searchFilterTemplates(term: string): Observable<FilterTemplate[]>;

  abstract createFilterTemplate (filterTemplate: FilterTemplate): Observable<FilterTemplate>;

  abstract updateFilterTemplate (filterTemplate: FilterTemplate): Observable<FilterTemplate>;

  abstract deleteFilterTemplate (id: number): Observable<{}>;
}
