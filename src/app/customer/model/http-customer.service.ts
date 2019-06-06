import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, forkJoin, of } from 'rxjs';
import { tap, mergeMap, catchError, switchMap } from 'rxjs/operators';

import { Customer } from './customer';
import { CustomerService } from './customer.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { HttpUtilsService } from '../../shared/http-utils.service';
import { MessageService } from '../../shared/message.service';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';


/**
 * Service for accessing and maintaining customers
 * on a remote http server (via HTTP REST API).
 * ####################################################################
 *
 * - See also https://github.com/angular/in-memory-web-api/blob/master/src/app/http-client-hero.service.ts
 */

@Injectable()
export class HttpCustomerService extends CustomerService {

  /** Http REST API */
  private customersUrl = 'api/customers';

  /** Http Header for create/update/delete methods */
  private cudOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };


  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandler,
    private httpUtils: HttpUtilsService,
    private messageService: MessageService,
  ) {
    super();
  }


  // ##################################################################
  // CREATE methods
  // ##################################################################


  /**
   * Create the specified customer on the http server.
   * ##################################################################
   *
   * HTTP POST - ?Response (with the generated customer.id) expected.
   */

  createCustomer(customer: Customer): Observable<Customer> {

    const message = `Customer with id = ${customer.id} and name = "${customer.name}" has been created.`;

    return this.http.post<Customer>(this.customersUrl, customer, this.cudOptions)
      .pipe(
        tap(() => this.show(message)),
        tap(() => this.log(message)),
        catchError(this.handleError<Customer>(message.replace('has been', 'can not be'))),
      );
  }



  // ##################################################################
  // DELETE methods
  // ##################################################################


  /**
   * Delete the customer with the specified id.
   * ##################################################################
   * Returns an empty object.
   *
   * HTTP DELETE - Null response expected.
   */

  deleteCustomer(id: number): Observable<{}> {

    const message = `Customer ${id} deleted.`;

    return this.http.delete(this.customersUrl + `/${id}`, this.cudOptions)
      .pipe(
        tap(() => this.show(message)),
        tap(() => this.log(message)),
        catchError(this.handleError<Customer>(`Customer ${id} can not be deleted.`)),
      );
  }


  /**
   * Delete the customers with the specified ids.
   * ##################################################################
   * Returns an empty object.
   *
   * HTTP DELETE - Null response expected.
   */

  deleteCustomers(ids: number[] = []): Observable<any> {

    const message = ids.length > 1 ?
      `Selected ${ids.length} customers deleted.` :
      `Customer ${ids[0]} deleted.`;
    const tasks$ = [];

    for (let i = 0; i < ids.length; i++) {
      tasks$.push(this.deleteOneCustomer(ids[i]));
    }

    return forkJoin(tasks$)
      .pipe(
        tap(() => this.show(message)),
        tap(() => this.log(message)),
        catchError(this.handleError<Customer>('deleteCustomers(ids)')),
      );

  }


  /** Delete one customer. */
  private deleteOneCustomer(id: number): Observable<any> {

    return this.http.delete(this.customersUrl + `/${id}`, this.cudOptions);

  }



  // ##################################################################
  // GET methods
  // ##################################################################


  /**
   * Get the customer with the specified id.
   * ##################################################################
   */

  getCustomer(id: number): Observable<Customer> {

    return this.http.get<Customer>(this.customersUrl + `/${id}`)
      .pipe(
        catchError(this.handleError<Customer>(`Get customer id=${id}`))
      );
  }


  /**
   * Get the customers with the specified QueryParams.
   * ##################################################################
   *
   * @param queryParams   The filter, sort, and page parameters.
   * @return queryResult  The filtered and sorted items (customer) array.
   *
   * - This code emulates real server response by getting all customers
   *   from the server and performing client-side filtering, sorting, and paginating.
   *
   * - Note: getCustomers() returns a QueryResult Observable;
   *         http.get()     returns a Customer[] Observable.
   *
   * - mergeMap
   *   maps each value (Customer[]) emitted by the source observable
   *   to a new observable (queryResult) which is merged in the output observable.
   *
   * - switchMap
   *   maps the *most recent*  value (Customer[]) emitted by source observable
   *   to a new observable (queryResult) which is merged in the output observable.
   *   It switches whenever a new value is emitted.
   */

  getCustomers(queryParams?: QueryParams): Observable<QueryResult> {

    if (queryParams.searchTerm) {

      this.log(
        `[getCustomers(queryParams) / searchTerm] queryParams = \n ${JSON.stringify(queryParams)}`
      );

      // Search term (for searching in all fields) is set.
      return this.http.get<Customer[]>(this.customersUrl)
        .pipe(
          switchMap(res => {
            // ===============================================================
            const queryResult = this.httpUtils.searchInAllFields(res, queryParams);
            // ===============================================================
            return of(queryResult);
          }),
          catchError(this.handleError<QueryResult>('http.get in getCustomers(queryParams.searchTerm)'))
        );

    } else {

      this.log(
        `[getCustomers(queryParams) / filters] queryParams = \n ${JSON.stringify(queryParams)}`
      );

      // Filters are set (or empty = select all).
      return this.http.get<Customer[]>(this.customersUrl)
        .pipe(
          switchMap(res => {
            // ===============================================================
            const queryResult = this.httpUtils.filterAndSort(res, queryParams);
            // ===============================================================
            return of(queryResult);
          }),
          catchError(this.handleError<QueryResult>('http.get in getCustomers(queryParams)'))
        );

    }

  }



  // ##################################################################
  // UPDATE methods
  // ##################################################################


  /**
   * Update the specified customer on the http server.
   * ##################################################################
   * Returns the updated customer upon success.
   *
   * HTTP PUT - Null response expected.
   */

  updateCustomer(customer: Customer): Observable<Customer> {
    // const httpHeader = this.httpUtils.getHttpHeaders();

    const message = `Customer with id = ${customer.id} and name = "${customer.name}" has been updated.`;

    return this.http.put<Customer>(this.customersUrl, customer, this.cudOptions)
      .pipe(
        tap(() => this.show(message)),
        tap(() => this.log(message)),

        catchError(this.handleError<Customer>(message.replace('has been', 'can not be'))),
      );
  }



  // ##################################################################
  // Private helper methods
  // ##################################################################


  /**
   * Handling http errors.
   * ##################################################################
   * Delegating to the httpErrorHandler service.
   */

  private handleError<T>(operationFailed: string) {
    return this.httpErrorHandler.handleError<T>('http-customer.service.ts', operationFailed);
  }

  /**
   * Logging / showing messages.
   * ##################################################################
   * Delegating to the message service.
   */

  /** Logging message to console. */
  private log(message: string) {
    return this.messageService.logMessage('[http-customer.service.ts] ' + message);
  }

  /** Showing a user friendly message. */
  private show(message: string) {
    return this.messageService.showMessage(message);
  }


}
