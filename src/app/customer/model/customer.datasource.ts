/**
 * Initial version based on Metronic 5.5.5.
 */
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

import { of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';

import { Customer } from './customer';
import { HttpCustomerService as CustomerService } from './http-customer.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';




/**
 * The CustomerDataSource class provides the data for the data table
 * in the CustomerListComponent.
 *
 * The data table listens (subscribes) to the customers data stream
 * and automatically triggers an update every time new data is emitted.
 */
export class CustomerDataSource implements DataSource<any> {

  // customers: Customer[];
  // customers$: Observable<Customer[]>;

  /** Subject for accepting and emitting customer arrays. */
  customers: BehaviorSubject<Customer[]> = new BehaviorSubject([]);

  /**
   * Subject for accepting and emitting loading true/false
   * (the progress bar listens to this stream).
   */
  isLoading = new BehaviorSubject<boolean>(false);

  /** Subject for accepting and emitting the total number of queried customers. */
  totalNumberOfItems = new BehaviorSubject<number>(0);

  /** Needed e.g. for showing message: 'No customers found' */
  hasItems = false;


  constructor(private customerService: CustomerService) {
    this.totalNumberOfItems.subscribe(nr => (this.hasItems = nr > 0));
  }


  /**
   * Connecting the data table by returning the customers observable.
   * The data table renders a row for each object in the data array.
   */
  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.customers.asObservable();
  }

  /** Disconnecting the data table. */
  disconnect(collectionViewer: CollectionViewer): void {
    this.customers.complete();
    this.isLoading.complete();
    this.totalNumberOfItems.complete();
  }


  /**
   * getCustomers()
   * ##################################################################
   * is implemented by delegating to the customer service.
   * If the data arrives successfully, it is passed to the customers
   * subject (by calling next(res.items)), which in turn emits the data
   * to the connected data table for rendering.
   */

  // getCustomers(queryParams: QueryParams) {
  //   this.isLoading.next(true);
  //   /**
  //    * Delegating to customer service which returns a query result observable.
  //    * ###########################################
  //    */
  //   this.customerService.getCustomers(queryParams)
  //     .pipe(
  //       tap((res: QueryResult) => {
  //         /**
  //          * Passing the queryResult.items to the customers subject, which
  //          * emits the data to the connected (subscribed) data table for rendering.
  //          */
  //         this.customers.next(res.items);

  //         this.totalNumberOfItems.next(res.totalCount);
  //       }),
  //       catchError(err => of(new QueryResult())), // TODO
  //       finalize(() => this.isLoading.next(false))
  //     )
  //     .subscribe();
  // }


  getCustomers(queryParams: QueryParams) {
    this.isLoading.next(true);
    /**
     * Delegating to customer service which returns a query result observable.
     * ###########################################
     */
    this.customerService.getCustomers(queryParams)

      .subscribe((res: QueryResult) => {
        /**
         * Passing the queryResult.items to the customers subject, which
         * emits the data to the connected (subscribed) data table for rendering.
         */
        this.customers.next(res.items);

        this.totalNumberOfItems.next(res.totalCount);

        this.isLoading.next(false);
      });

  }


}
