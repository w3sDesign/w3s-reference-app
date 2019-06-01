import { Customer } from './customer';
import { Observable } from 'rxjs';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';

import { CustomerFilterTemplate } from './customer-filter-template';
import { QuestionBase } from '../../shared/dynamic-form/question-base';

/**
 * Data Service - Accessing and maintaining `Customer` data - Interface.
 * ####################################################################
 */

export abstract class CustomerService {

  // /** TODO Move to http-customer service! HTTP REST APIs */
  // customersUrl = 'api/customers';
  // customerFilterTemplatesUrl = 'api/customerFilterTemplates';

  /** Get the customer with the specified id. */
  abstract getCustomer(id: number): Observable<Customer>;

  /** Get the customers with the specified QueryParams. */
  abstract getCustomers (queryParams?: QueryParams): Observable<QueryResult>;

  /** Create the specified customer. */
  abstract createCustomer (customer: Customer): Observable<Customer>;

  /** Update the specified customer. */
  abstract updateCustomer (customer: Customer): Observable<Customer>;

  /** Delete the customer with the specified id. */
  abstract deleteCustomer (id: number): Observable<{}>;


  /** Customer filter templates */

  abstract getCustomerFilterTemplate (id: number): Observable<CustomerFilterTemplate>;
  abstract getCustomerFilterTemplates (): Observable<CustomerFilterTemplate[]>;

}
