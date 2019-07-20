import { CollectionViewer, DataSource } from '@angular/cdk/collections';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';

import { Customer } from './customer';
import { CustomerService } from './customer.service';

import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';
import { HttpUtilsService } from '../../shared/http-utils.service';


/**
 * Component for encapsulating data retrieval for the data table.
 * ####################################################################
 *
 * The data table component does not know (is independent of)
 * where the data is coming from.
 *
 * The data table subscribes to an Observable provided by the data source
 * and automatically triggers an update every time new data is emitted.
 */

export class CustomerDataSource implements DataSource<any> {

  /** Accepting/emitting customer arrays. */
  private customersSubject = new BehaviorSubject<Customer[]>([]);

  public customers$ = this.customersSubject.asObservable();

  /** Subject for accepting and emitting loading true/false. */
  isLoading = new BehaviorSubject<boolean>(false);

  /** Subject for accepting and emitting the total number of queried customers. */
  totalNumberOfItems = new BehaviorSubject<number>(0);

  /** Needed e.g. for showing message: 'No customers found' */
  hasItems = false;


  constructor(
    private customerService: CustomerService,
    private httpUtils: HttpUtilsService,
  ) {
    this.totalNumberOfItems.subscribe(nr => (this.hasItems = nr > 0));
  }


  /**
   * Connecting the data table.
   * ##################################################################
   *
   * https://blog.angular-university.io/angular-material-data-table/
   *
   * This method will be called once by the data table at bootstrap time.
   * The data table subscribes to the observable that this method returns.
   * The observable emits the customers that should be displayed.
   * The data table renders a row for each object in the data array.
   */

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.customersSubject.asObservable();
  }

  /**
   * Disconnecting the data table.
   * ##################################################################
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.customersSubject.complete();
    this.isLoading.complete();
    this.totalNumberOfItems.complete();
  }


  /**
   * Getting the customers.
   * ##################################################################
   *
   * Implemented by delegating to the customer service.
   * If the data arrives successfully, it is passed to the customers
   * subject (by calling next(res.items)), which in turn emits the data
   * to the connected (subscribed) data table for rendering.
   */

  getCustomers(queryParams: QueryParams) {

    this.isLoading.next(true);

    this.customerService.getCustomers(queryParams).pipe(

      // new filter+sort handling in data source!
      // removing form customer service

      switchMap((res1: QueryResult) => {

        // if (!queryParams) { queryParams = new QueryParams(); }

        if (queryParams.searchTerm) {


          // TODO

        } else if (queryParams.filter) {

          // ========================================================
          // Client side filtering and sorting.
          // Moved from http-customer.service
          // ========================================================

          const filteredItems = this.httpUtils.filterItems(
            res1.items, queryParams.filter);

          const sortedItems = this.httpUtils.sortItems(
            filteredItems, queryParams.sortField, queryParams.sortOrder);

          const queryResult = this.httpUtils.createQueryResult(
            sortedItems, queryParams);

          return of(queryResult);

        } else {

          // Sort in any case.
          const sortedItems = this.httpUtils.sortItems(
            res1.items, queryParams.sortField, queryParams.sortOrder);

          const queryResult = this.httpUtils.createQueryResult(
            sortedItems, queryParams);

          return of(queryResult);

        }

      }))

      // Customer service  returns a query result observable.
      .subscribe((res: QueryResult) => {

        // Emitting the customers.
        this.customersSubject.next(res.items);

        this.totalNumberOfItems.next(res.totalCount);

        this.isLoading.next(false);

      });

  }


}
