/**
 * ####################################################################
 * TODO SnackBar - see DELETE
 * ####################################################################
 *
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { tap, mergeMap, catchError } from 'rxjs/operators';

import { Customer } from './customer';
import { CustomerService } from './customer.service';
import { HttpErrorHandler, HandleError } from '../../shared/http-error-handler.service';
import { HttpUtilsService } from '../../shared/http-utils.service';
import { MessageService } from '../../shared/message.service';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';

import { MatSnackBar } from '@angular/material';
import { MessageSnackBarComponent } from '../../shared/message-snack-bar/message-snack-bar.component';

/**
 * Re-exporting HttpCustomerService as CustomerService,
 * making client code independent of a concrete implementation
 * (by importing CustomerService from xxx-customer.service).
 */
export { HttpCustomerService as CustomerService };


/** Headers for Create/Update/Delete methods */
const cudOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

/**
 * ####################################################################
 * Injectable customer data access service via HTTP REST API.
 *
 * See also angular/in-memory-web-api/src/app/http-client-hero.service.ts
 * ####################################################################
 */
@Injectable()
export class HttpCustomerService extends CustomerService {

  private handleError2: HandleError;

  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandler,

    private httpUtils: HttpUtilsService,
    private messageService: MessageService,
    private snackBar: MatSnackBar,
    // private messageSnackBar: MessageSnackBarComponent
  ) {
    super();
    this.handleError2 = httpErrorHandler.createHandleError('HttpCustomerService');
  }


  /**
   * ##################################################################
   * Get a customer by id from the remote http data server.
   * ##################################################################
   */
  getCustomer(id: number): Observable<Customer> {
    return this.http
      .get<Customer>(this.customersUrl + `/${id}`)
      .pipe(
        catchError(this.handleError2<Customer>(`Get customer id=${id}`))
      );
  }


  /**
   * ##################################################################
   * Get customers from the remote http data server.
   *
   * This code emulates real server response
   * (by getting all customers and performing
   * client-side filtering, sorting, and pagination).
   *
   * If no params specified, all customers are returned.
   *
   * Note: getCustomers() returns QueryResult
   *       http.get()     returns Customer[]
   * ##################################################################
   */
  getCustomers(queryParams?: QueryParams): Observable<QueryResult> {
    if (queryParams) {
      return this.http.get<Customer[]>(this.customersUrl).pipe(
        catchError(this.handleError2('getCustomers with queryParams', [])),
        mergeMap(res => {
          const queryResult = this.httpUtils.baseFilter(res, queryParams, [
            'status',
            'type'
          ]);
          return of(queryResult);
        })
      );
    }
    // getCustomers() = no queryParams, all customers returned.
    return this.http.get<Customer[]>(this.customersUrl)
      .pipe(
        catchError(this.handleError2('getCustomers', [])),
        mergeMap(res => {
          const queryResult = new QueryResult();
          queryResult.items = res;
          queryResult.totalCount = queryResult.items.length;
          return of(queryResult);
        })
      );
  }


  /**
   * ##################################################################
   * Experimental
   * ##################################################################
   */
  searchCustomers(term: string): Observable<Customer[]> {
    term = term.trim();
    // add safe, encoded search parameter if term is present
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<Customer[]>(this.customersUrl, options).pipe(
      catchError(this.handleError2<Customer[]>('Search customers'))
    );
  }


  /**
   * ##################################################################
   * Create a customer on the remote http data server.
   *
   * POST - Customer response (with the generated customer.id) expected.
   * ##################################################################
   */
  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.customersUrl, customer, cudOptions)
      .pipe(
        catchError(this.handleError2<Customer>('Create customer')),
        // tap((cust: Customer) => this.log(`Create customer id=${cust.id}`))
      );
  }


  /**
   * ##################################################################
   * Update the customer on the remote data server.
   * Returns the updated customerupon success.
   *
   * PUT - Null response expected.
   * ##################################################################
   */
  updateCustomer(customer: Customer): Observable<Customer> {
    // const httpHeader = this.httpUtils.getHttpHeaders();
    const message = `Customer ${customer.id} updated.`;
    return this.http.put<Customer>(this.customersUrl, customer, cudOptions)
      .pipe(
        catchError(this.handleError2('updateCustomer', customer)),
        tap(() => this.openSnackBar(message)),
        tap(() => this.log(message)),
      );
  }


  /**
   * ##################################################################
   * Delete the customer from the remote data server.
   * Returns an empty object.
   *
   * DELETE - Null response expected.
   *
   * TODO: should we report customer.id NOT FOUND?
   * ##################################################################
   */
  deleteCustomer(id: number): Observable<{}> {
    const message = `Customer ${id} deleted.`;
    return this.http.delete(this.customersUrl + `/${id}`, cudOptions)
      .pipe(
        catchError(this.handleError2('deleteCustomer')),
        tap(() => this.openSnackBar(message)),
        tap(() => this.log(message)),
      );
  }


  /**
   * ##################################################################
   * Delete multiple customers.
   * ##################################################################
   */
  deleteCustomers(ids: number[] = []): Observable<any> {
    const message = ids.length > 1 ?
      `Seleted ${ids.length} customers deleted.` :
      `Customer ${ids[0]} deleted.`;
    const tasks$ = [];
    for (let i = 0; i < ids.length; i++) {
      tasks$.push(this.deleteOneCustomer(ids[i]));
    }
    return forkJoin(tasks$)
      .pipe(
        catchError(this.handleError2('deleteCustomers')),
        tap(() => this.openSnackBar(message))
      );

  }

  deleteOneCustomer(id: number): Observable<any> {
    return this.http.delete(this.customersUrl + `/${id}`, cudOptions);
  }





  /**
   * ##################################################################
   * Helper functions
   * ##################################################################
   */
  openSnackBar(message: string) {
    this.snackBar.openFromComponent(MessageSnackBarComponent, {
      data: message,
      duration: 3000,
      verticalPosition: 'top',
      panelClass: 'w3s-snack-bar', // adds to snack-bar-container
    });
  }

  openSnackBarSimple(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: 'w3s-snack-bar', /* added to snack-bar-container */
    });
  }


  /** Log a CustomerService message */
  private log(message: string) {
    this.messageService.add('CustomerService: ' + message);
    console.log('CustomerService: ' + message); // test
  }

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
