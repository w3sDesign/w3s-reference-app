import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

import { Observable, forkJoin, of } from 'rxjs';
import { tap, mergeMap, catchError, switchMap } from 'rxjs/operators';

import { Customer } from './customer';
import { CustomerService } from './customer.service';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';
import { HttpUtilsService } from '../../shared/http-utils.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { MessageService } from '../../shared/message.service';
import { MessageSnackBarComponent } from '../../shared/message-snack-bar/message-snack-bar.component';

import { CustomerFilterTemplate } from './customer-filter-template';

// /**
//  * Re-exporting HttpCustomerService as CustomerService,
//  * making client code independent of a concrete implementation
//  * (by importing CustomerService from http-customer.service).
//  */
// export { HttpCustomerService as CustomerService };



/**
 * Service for accessing and maintaining `Customer` data on a remote
 * http server (via HTTP REST API).
 * ####################################################################
 *
 * - See also https://github.com/angular/in-memory-web-api/blob/master/src/app/http-client-hero.service.ts
 *
 */

@Injectable()
export class HttpCustomerService extends CustomerService {

  private showTestValues = true;

  /** Http REST APIs */
  private customersUrl = 'api/customers';
  private customerFilterTemplatesUrl = 'api/customerFilterTemplates';

  /** Http Header for create/update/delete methods */
  private cudOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };


  // private handleError: HandleError;

  // private filterTemplate: CustomerFilterTemplate;


  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandler,

    private httpUtils: HttpUtilsService,
    private messageService: MessageService,
    private snackBar: MatSnackBar,
    // private overlay: Overlay,
  ) {
    super();

    /** Create a convenience handleError function that already knows the service name.*/
    // this.handleError = httpErrorHandler.createHandleError('HttpCustomerService');
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


  /**
   * Create the specified customer filter template on the http server.
   * ##################################################################
   *
   * HTTP POST
   */

  createCustomerFilterTemplate(filterTemplate: CustomerFilterTemplate): Observable<CustomerFilterTemplate> {

    const message = `Filter template with id = ${filterTemplate.id} and name = "${filterTemplate.name}" has been created.`;

    return this.http.post<CustomerFilterTemplate>(this.customerFilterTemplatesUrl, filterTemplate, this.cudOptions)
      .pipe(
        tap(() => this.show(message)),
        tap(() => this.log(message)),
        catchError(this.handleError<CustomerFilterTemplate>(message.replace('has been', 'can not be'))),
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
   * TODO: should we report customer.id NOT FOUND?
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
   * TODO: should we report customer.id NOT FOUND?
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
   * from the server and performs client-side filtering, sorting, and paginating.
   *
   * - Note: getCustomers() returns QueryResult Observable;
   *       http.get()     returns Customer[] Observable.
   *
   * - mergeMap
   * maps each value (Customer[]) emitted by the source observable
   * to a new observable (queryResult) which is merged in the output observable.
   *
   * - TODO?  switchMap
   * maps the *most recent*  value (Customer[]) emitted by source observable
   * to a new observable (queryResult) which is merged in the output observable.
   * It switches whenever a new value is emitted.
   */

  getCustomers(queryParams?: QueryParams): Observable<QueryResult> {

    if (queryParams.searchTerm) {

      this.log(
        `[getCustomers(queryParams) / searchTerm] queryParams = \n ${JSON.stringify(queryParams)}`
      );

      if (this.showTestValues) {
        console.log('%c# SearchTerm ######### queryParams [getCustomers()] = \n' +
          JSON.stringify(queryParams), 'color: blue');
      }

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

      if (this.showTestValues) {
        console.log('%c# With/Without Filters ######### queryParams [getCustomers()] = \n' +
          JSON.stringify(queryParams), 'color: blue');
      }

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


  /**
   * Get the customer filter template with the specified id.
   * ##################################################################
   */

  getCustomerFilterTemplate(id: number): Observable<CustomerFilterTemplate> {

    return this.http.get<CustomerFilterTemplate>(this.customerFilterTemplatesUrl + `/${id}`)
      .pipe(
        catchError(this.handleError<CustomerFilterTemplate>(`Get customerFilterTemplate id=${id}`))
      );
  }


  /**
   * Get all customer filter templates.
   * ##################################################################
   */

  getCustomerFilterTemplates(): Observable<CustomerFilterTemplate[]> {

    return this.http.get<CustomerFilterTemplate[]>(this.customerFilterTemplatesUrl)
      .pipe(
        catchError(this.handleError<CustomerFilterTemplate[]>('getCustomerFilterTemplates()'))
      );
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


  /**
   * Update the specified customer filter template on the http server.
   * ##################################################################
   *
   * HTTP PUT
   */

  updateCustomerFilterTemplate(customerFilterTemplate: CustomerFilterTemplate): Observable<CustomerFilterTemplate> {

    // const httpHeader = this.httpUtils.getHttpHeaders();

    const message = `CustomerFilterTemplate with id = ${customerFilterTemplate.id}
 and name = "${customerFilterTemplate.name}" has been updated.`;

    return this.http.put<CustomerFilterTemplate>(this.customerFilterTemplatesUrl, customerFilterTemplate, this.cudOptions)
      .pipe(
        tap(() => this.show(message)),
        tap(() => this.log(message)),

        catchError(this.handleError<CustomerFilterTemplate>(message.replace('has been', 'can not be'))),
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

// Moved to message.service
  // private openSnackBar(message: string) {
  //   this.snackBar.openFromComponent(MessageSnackBarComponent, {
  //     data: message,
  //     duration: 5000,
  //     verticalPosition: 'top',
  //     panelClass: 'w3s-snack-bar', // adds to snack-bar-container
  //   });
  // }







  // UPDATE Status
  // updateStatusForCustomer(
  //   customers: Customer[],
  //   status: number
  // ): Observable<any> {
  //   const tasks$ = [];
  //   for (let i = 0; i < customers.length; i++) {
  //     const customer = customers[i];
  //     customer.status = status;
  //     tasks$.push(this.updateCustomer(customer));
  //   }
  //   return forkJoin(tasks$);


}
