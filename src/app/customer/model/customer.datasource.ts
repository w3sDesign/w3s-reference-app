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
import { CustomerService } from './http-customer.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';




/**
 * The CustomerDataSource class provides the data for the CustomerListComponent.
 *
 * The list component listens (subscribes) to the data stream emitted by the data source
 * and automatically triggers an update every time a new data is emitted.
 */
export class CustomerDataSource implements DataSource<any> {

  // customers: Customer[];
  // customers$: Observable<Customer[]>;

  /** Subject emitting customer arrays. */
customers = new BehaviorSubject<Customer[]>([]);

hasItems = false; // Need to show message: 'No customers found'

/**
 * Subject emitting loading in progress boolen
 * (the progress bar will listen to this stream)
 * Stream accepting and emitting true/false (needed for progress bar).
 *
*/
isLoading = new BehaviorSubject<boolean>(false);

/** Stream accepting and emitting the total number of customers. */
totalNumberOfItems = new BehaviorSubject<number>(0);


constructor(private customerService: CustomerService) {
  this.totalNumberOfItems.subscribe(nr => (this.hasItems = nr > 0));
}


/**
 * The data table calls the connect method to receive the customers to be displayed.
 * The data table renders a row for each object in the data array.
 */
connect(collectionViewer: CollectionViewer): Observable < any[] > {
  return this.customers.asObservable();
}

// Disonnecting the data table.
disconnect(collectionViewer: CollectionViewer): void {
  this.customers.complete();
  this.isLoading.complete();
  this.totalNumberOfItems.complete();
}


/**
 * The customer data source implements the loadCustomer() method by delegating
 * to the customerService to get the customer data from the HTTP REST server.
 * If the data arrives successfully, it is passed to the data stream
 * (by calling next(data) on the data stream).
 */

loadCustomers(queryParams: QueryParams) {
  this.isLoading.next(true);

  this.customerService.getCustomers(queryParams)
    .pipe(
      tap((res: QueryResult) => {
        /**
         * Passing the queryResult.items (= customer arry) to the data
         * stream (customers). This causes the data stream to emit the data
         * to the connected data table, which redisplays.
         */
        this.customers.next(res.items);
        // this.customers = res.items;

        this.totalNumberOfItems.next(res.totalCount);
      }),
      catchError(err => of(new QueryResult())), // TODO
      finalize(() => this.isLoading.next(false))
    )
    .subscribe();
}
}
