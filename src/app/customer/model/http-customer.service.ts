import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { tap, mergeMap, catchError } from 'rxjs/operators';

import { Customer } from './customer';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';
import { MessageService } from '../../shared/message/message.service';
import { MessageSnackBarComponent } from '../../shared/message-snack-bar/message-snack-bar.component';
import { HttpUtilsService } from '../../shared/http-utils.service';
import { CustomerService } from './customer.service';

export { HttpCustomerService as CustomerService };

const cudOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

/**
 * Injectable customer data access service
 * on a remote HTTP data server via a REST API.
 * See https://github.com/angular/in-memory-web-api/blob/master/src/app/http-client-hero.service.ts
 * (src/app = test app and its tests; src/in-mem = the source code of the library).
 */

// @Injectable({ providedIn: 'root' })
@Injectable()
export class HttpCustomerService extends CustomerService {
  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    private messageService: MessageService
    // private messageSnackBar: MessageSnackBarComponent
  ) {
    super();
  }

  /**
   * Get a customer from the remote data server.
   */
  getCustomer(id: number): Observable<Customer> {
    return this.http
      .get<Customer>(this.customersUrl + `/${id}`)
      .pipe(
        catchError(this.handleError<Customer>(`Get customer id=${id}`))
      );
  }

  /**
    * Get customers from the remote data server.
    */
  getCustomers(queryParams?: QueryParams): Observable<QueryResult> {
    if (!queryParams) {
      /** Returns all customers (Observable of Customer[]). */
      return this.http.get<QueryResult>(this.customersUrl).pipe(
          catchError(this.handleError<QueryResult>('Get all customers'))
        );
    }
    /**
      * This code emulates real server response
      * (by getting all customers and performing
      * client-side filtering, sorting, and pagination).
      * Returns Observable of QueryResult
      * (items: any[], totalCount: number).
      */
    return this.http.get<Customer[]>(this.customersUrl).pipe(
      mergeMap(res => {
        const result = this.httpUtils.baseFilter(res, queryParams, [
          'status',
          'type'
        ]);
        return of(result);
      })
    );
  }

  searchCustomers(term: string): Observable<Customer[]> {
    term = term.trim();
    // add safe, encoded search parameter if term is present
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<Customer[]>(this.customersUrl, options).pipe(
      catchError(this.handleError<Customer[]>('Search customers'))
    );
  }

  /**
   * Create a customer on the remote data server.
   * POST - Customer response (with the generated customer.id) expected.
   */
  createCustomer(customer: Customer): Observable<Customer> {
    return this.http
      .post<Customer>(this.customersUrl, customer, cudOptions)
      .pipe(
        tap((cust: Customer) =>
          this.log(`Create customer id=${cust.id}`)
        ),
        catchError(this.handleError<Customer>('Create customer'))
      );
  }

  /**
   * Update a customer on the remote data server.
   * PUT - Null response expected.
   */
  updateCustomer(customer: Customer): Observable<Customer> {
    // const httpHeader = this.httpUtils.getHttpHeaders();
    const message = `Update customer id=${customer.id}`;
    return this.http
      // .put<Customer>(this.customersUrl, customer, { headers: httpHeader })
      .put<Customer>(this.customersUrl, customer, cudOptions)
      .pipe(
        tap(() => this.log(message)),
        catchError(this.handleError<Customer>(message))
      );
  }

  /**
   * Delete a customer from the remote data server.
   * DELETE - Null response expected.
   *
   * TODO: should we report customer.id NOT FOUND?
   */
  deleteCustomer(id: number): Observable<any> {
    const message = `Customer ${id} deleted.`;
    return this.http
      .delete(this.customersUrl + `/${id}`, cudOptions)
      .pipe(
        tap(() => this.log(message)),
        // tap(() => this.openSnackBar("Customer deleted.")),
        catchError(this.handleError(message))
      );
  }

  /**
   * Delete multiple customers.
   */
  deleteCustomers(ids: number[] = []): Observable<any> {
    const tasks$ = [];
    for (let i = 0; i < ids.length; i++) {
      tasks$.push(this.deleteCustomer(ids[i]));
    }
    return forkJoin(tasks$);
  }


  /**
   * Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   * TODO: client/server-side error.
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a CustomerService message */
  private log(message: string) {
    this.messageService.add('CustomerService: ' + message);
    console.log('CustomerService: ' + message); // test
  }

}




  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error("An error occurred:", error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.error(
  //       `Backend returned code ${error.status}, ` + `body was: ${error.error}`
  //     );
  //   }
  //   // return an observable with a user-facing error message
  //   return throwError("Something bad happened; please try again later.");
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
  // }


/**
 * Get/Read all customers from the remote data server.
 * GET - Customer[] response expected.
 */
  // getCustomersSaveOrig(): Observable<Customer[]> {
  //   return this.http
  //     .get<Customer[]>(this.customersUrl)
  //     .pipe(catchError(this.handleError<Customer[]>('Get/Read all customers')));
  // }

// Method from server should return QueryResult
  // (items: any[], totalCount: number).
  // getCustomersOrig(queryParams: QueryParams): Observable<QueryResult> {
  //   // This code emulates real server response
  //   // (by getting all customers and performing
  //   // client-side filtering, sorting, and pagination).
  //   const url = this.customersUrl;
  //   return this.http.get<Customer[]>(this.customersUrl).pipe(
  //     mergeMap(res => {
  //       const result = this.httpUtils.baseFilter(res, queryParams, [
  //         'status',
  //         'type'
  //       ]);
  //       return of(result);
  //     })
  //   );
  // }

