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
import { Overlay } from '@angular/cdk/overlay';
import { CustomerFilterTemplate } from './customer-filter-template';
import { QuestionBase } from '../../shared/dynamic-form/question-base';

/**
 * Re-exporting HttpCustomerService as CustomerService,
 * making client code independent of a concrete implementation
 * (by importing CustomerService from http-customer.service).
 */
export { HttpCustomerService as CustomerService };


/** Headers for Create/Update/Delete methods */
const cudOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

/**
 * ####################################################################
 * Injectable http data access service (via HTTP REST API).
 *
 * See also angular/in-memory-web-api/src/app/http-client-hero.service.ts
 * ####################################################################
 */
@Injectable()
export class HttpCustomerService extends CustomerService {

  private handleError: HandleError;

  private filterTemplate: CustomerFilterTemplate;


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
    this.handleError = httpErrorHandler.createHandleError('HttpCustomerService');
  }


  /**
   * ##################################################################
   * Get a customer by id from the remote http data server.
   * ##################################################################
   */
  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(this.customersUrl + `/${id}`)
      .pipe(
        catchError(this.handleError<Customer>(`Get customer id=${id}`))
      );
  }

  /**
   * ##################################################################
   * Get customers from the remote http data server.
   *
   * This code emulates real server response by getting all customers
   * and performing client-side filtering, sorting, and pagination.
   *
   * Note: getCustomers() returns QueryResult
   *       http.get()     returns Customer[]
   * ##################################################################
   */
  getCustomers(queryParams?: QueryParams): Observable<QueryResult> {
    if (queryParams) {
      return this.http.get<Customer[]>(this.customersUrl)
        .pipe(
          mergeMap(res => {
            // ===============================================================
            const queryResult = this.httpUtils.filterAndSort(res, queryParams);
            // ===============================================================
            return of(queryResult);
          }),
          catchError(this.handleError('getCustomers with queryParams', new QueryResult()))
        );
    }

    // No queryParams, all customers returned.
    return this.http.get<Customer[]>(this.customersUrl)
      .pipe(
        mergeMap(res => {
          const queryResult = new QueryResult();
          queryResult.items = res;
          queryResult.totalCount = queryResult.items.length;
          return of(queryResult);
        }),
        catchError(this.handleError('getCustomers', new QueryResult()))
      );
  }





  /**
    * ##################################################################
    * Get a customer filter template by id.
    * ##################################################################
    */
  getCustomerFilterTemplate(id: number): Observable<CustomerFilterTemplate> {
    return this.http.get<CustomerFilterTemplate>(this.customerFilterTemplatesUrl + `/${id}`)
      .pipe(
        catchError(this.handleError<CustomerFilterTemplate>(`Get customerFilterTemplate id=${id}`))
      );
  }


  /**
   * ##################################################################
   * Get all customer filter templates.
   * ##################################################################
   */
  getCustomerFilterTemplates(): Observable<CustomerFilterTemplate[]> {
    return this.http.get<CustomerFilterTemplate[]>(this.customerFilterTemplatesUrl)
      .pipe(
        catchError(this.handleError<CustomerFilterTemplate[]>('Get customerFilterTemplates'))
      );
  }


  /**
   * ##################################################################
   * Get all customer filter template questions.
   * ##################################################################
   */

  getCustomerFilterTemplateQuestions(filterTemplateName: string = 'standard'): Observable<QuestionBase[]> {

    // // const filterTemplate = this.helper(filterTemplateName);
    // this.getCustomerFilterTemplates()
    //   .subscribe(
    //     res => {
    //       this.filterTemplate = res[0];
    //       // let arr = [];
    //       // const arr = res.filter(el => el.name === tmplName);
    //       // return arr[0];
    //     }
    //   );

    return this.http.get<QuestionBase[]>(this.customerFilterTemplateQuestionsUrl)
      .pipe(
        // tap(res => {
        //   res.forEach(el => {
        //     el.value = filterTemplate[el.key];
        //   });
        // }),

        // mergeMap(res => {
        //   const questions: QuestionBase[] = res;
        //   // id -> customerId, name -> customerName, ...
        //   // const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

        //   questions.forEach(question => {
        //     // question.value = this.filterTemplate['customer' + capitalize(question.key)];
        //     question.value = this.filterTemplate[question.key];
        //   });

        //   return of(questions);
        // }),

        catchError(this.handleError<QuestionBase[]>('Get customerFilterTemplateQuestions'))
      );
  }


  // helper(tmplName: string) {

  //   this.getCustomerFilterTemplates()
  //     .subscribe(
  //       res => {
  //         this.filterTemplate = res[0];
  //         // let arr = [];
  //         // const arr = res.filter(el => el.name === tmplName);
  //         // return arr[0];
  //       }
  //     );

  // }



  /**
   * ##################################################################
   * TODO
   * ##################################################################
   */
  searchCustomers(term: string): Observable<Customer[]> {
    term = term.trim();
    // add safe, encoded search parameter if term is present
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<Customer[]>(this.customersUrl, options)
      .pipe(
        catchError(this.handleError<Customer[]>('Search customers'))
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
    const message = `Customer with id = ${customer.id} and name = ${customer.name} has been created.`;
    return this.http.post<Customer>(this.customersUrl, customer, cudOptions)
      .pipe(
        tap(() => this.openSnackBar(message)),
        tap(() => this.log(message)),
        catchError(this.handleError<Customer>(message.replace('has been', 'has not been'))),
        );
  }

  /**
     * ##################################################################
     * Create a customer filter template on the remote data server.
     * ##################################################################
     */
  createCustomerFilterTemplate(filterTemplate: CustomerFilterTemplate): Observable<CustomerFilterTemplate> {
    const message = `Filter template with id = ${filterTemplate.id} and name = ${filterTemplate.name} has been created.`;
    return this.http.post<CustomerFilterTemplate>(this.customerFilterTemplatesUrl, filterTemplate, cudOptions)
      .pipe(
        tap(() => this.openSnackBar(message)),
        tap(() => this.log(message)),
        catchError(this.handleError<CustomerFilterTemplate>(message.replace('has been', 'has not been'))),
      );
  }


  /**
   * ##################################################################
   * Update a customer on the remote data server.
   * Returns the updated customer upon success.
   *
   * PUT - Null response expected.
   * ##################################################################
   */
  updateCustomer(customer: Customer): Observable<Customer> {
    // const httpHeader = this.httpUtils.getHttpHeaders();
    const message = `Customer with id = ${customer.id} and name = ${customer.name} has been updated.`;
    return this.http.put<Customer>(this.customersUrl, customer, cudOptions)
      .pipe(
        tap(() => this.openSnackBar(message)),
        tap(() => this.log(message)),
        catchError(this.handleError('updateCustomer', customer)),
      );
  }

  /**
     * ##################################################################
     * Update a customer filter template on the remote data server.
     * ##################################################################
     */
  updateCustomerFilterTemplate(customerFilterTemplate: CustomerFilterTemplate): Observable<CustomerFilterTemplate> {
    // const httpHeader = this.httpUtils.getHttpHeaders();
    const message = `CustomerFilterTemplate with id = ${customerFilterTemplate.id} and
        name = ${customerFilterTemplate.name} has been updated.`;
    return this.http.put<CustomerFilterTemplate>(this.customerFilterTemplatesUrl, customerFilterTemplate, cudOptions)
      .pipe(
        tap(() => this.openSnackBar(message)),
        tap(() => this.log(message)),
        catchError(this.handleError('updateCustomerFilterTemplate', customerFilterTemplate)),
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
        tap(() => this.openSnackBar(message)),
        tap(() => this.log(message)),
        catchError(this.handleError('deleteCustomer')),
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
        tap(() => this.openSnackBar(message)),
        tap(() => this.log(message)),
        catchError(this.handleError('deleteCustomers')),
      );

  }

  private deleteOneCustomer(id: number): Observable<any> {
    return this.http.delete(this.customersUrl + `/${id}`, cudOptions);
  }





  /**
   * ##################################################################
   * Helper functions
   * ##################################################################
   */
  private openSnackBar(message: string) {
    this.snackBar.openFromComponent(MessageSnackBarComponent, {
      data: message,
      duration: 5000,
      verticalPosition: 'top',
      panelClass: 'w3s-snack-bar', // adds to snack-bar-container
    });
  }

  private openSnackBarSimple(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: 'w3s-snack-bar', /* added to snack-bar-container */
    });
  }


  /** Log a CustomerService message */
  private log(message: string) {
    this.messageService.add('HttpCustomerService: ' + message);
    // console.log('CustomerService: ' + message);
  }




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
