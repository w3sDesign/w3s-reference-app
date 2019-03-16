
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

import { of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';

import { FilterTemplate } from './filter-template';
import { FilterTemplateService } from './mock-filter-template.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';




/**
 * The FilterTemplateDataSource class provides the data for the data table
 * in the FilterTemplateListComponent.
 *
 * The data table listens (subscribes) to the filterTemplates data stream
 * and automatically triggers an update every time new data is emitted.
 */
export class FilterTemplateDataSource implements DataSource<any> {

  // filterTemplates: FilterTemplate[];
  // filterTemplates$: Observable<FilterTemplate[]>;

  /** Subject accepting and emitting filterTemplate arrays. */
  filterTemplates = new BehaviorSubject<FilterTemplate[]>([]);

  /**
   * Subject accepting and emitting loading true/false
   * (the progress bar will listen to this stream).
   */
  isLoading = new BehaviorSubject<boolean>(false);

  /** Subject accepting and emitting the total number of queried filterTemplates. */
  totalNumberOfItems = new BehaviorSubject<number>(0);

  hasItems = false; // Need to show message: 'No filterTemplates found'


  constructor(private filterTemplateService: FilterTemplateService) {
    this.totalNumberOfItems.subscribe(nr => (this.hasItems = nr > 0));
  }


  /**
   * Connecting the data table to receive the filterTemplates to be displayed.
   * The data table renders a row for each object in the data array.
   */
  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.filterTemplates.asObservable();
  }

  /** Disconnecting the data table. */
  disconnect(collectionViewer: CollectionViewer): void {
    this.filterTemplates.complete();
    this.isLoading.complete();
    this.totalNumberOfItems.complete();
  }


  /**
   * loadFilterTemplate() is implemented by delegating to the filterTemplate service.
   * If the data arrives successfully, it is passed to the filterTemplates
   * subject (by calling next(res.items)), which in turn emits the data
   * to the connected data table for rendering.
   */
  loadFilterTemplates(queryParams: QueryParams) {
    this.isLoading.next(true);

    /**
     * Delegating to filterTemplate service.
     * Returns Observable QueryResult.
     * ###########################################
     */
    this.filterTemplateService.getFilterTemplates(queryParams)
      .pipe(
        tap((res: QueryResult) => {
          /**
           * Passing the queryResult.items to the filterTemplates subject,
           * which emits the data to the connected data table for rendering.
           */
          this.filterTemplates.next(res.items);

          this.totalNumberOfItems.next(res.totalCount);
        }),
        catchError(err => of(new QueryResult())), // TODO
        finalize(() => this.isLoading.next(false))
      )
      .subscribe();
  }
}
