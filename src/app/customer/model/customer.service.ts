import { Customer } from './customer';
import { Observable } from 'rxjs';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';

/**
 * Customer data access service - Interface
 */
export abstract class CustomerService {
  customersUrl = 'api/customers';  // URL to web api

  abstract getCustomer(id: number): Observable<Customer>;

  // abstract getCustomers (queryParams?: QueryParams): Observable<Customer[] | QueryResult>;
  abstract getCustomers (queryParams?: QueryParams): Observable<QueryResult>;

  abstract searchCustomers(term: string): Observable<Customer[]>;

  abstract createCustomer (customer: Customer): Observable<Customer>;

  abstract updateCustomer (customer: Customer): Observable<Customer>;

  abstract deleteCustomer (id: number): Observable<{}>;
}
