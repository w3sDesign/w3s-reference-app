import { Customer } from './customer';
import { Observable } from 'rxjs';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';

import { CustomerFilterTemplate } from './customer-filter-template';
import { QuestionBase } from '../../shared/dynamic-form/question-base';

/**
 * Customer data access service - Interface
 */
export abstract class CustomerService {

  /** REST WEB APIs */
  customersUrl = 'api/customers';
  customerFilterTemplatesUrl = 'api/customerFilterTemplates';
  customerFilterTemplateQuestionsUrl = 'api/customerFilterTemplateQuestions';

  /** Customer */
  abstract getCustomer(id: number): Observable<Customer>;

  abstract getCustomers (queryParams?: QueryParams): Observable<QueryResult>;

  abstract searchCustomers(term: string): Observable<Customer[]>;

  abstract createCustomer (customer: Customer): Observable<Customer>;

  abstract updateCustomer (customer: Customer): Observable<Customer>;

  abstract deleteCustomer (id: number): Observable<{}>;


  /** Customer filter templates */
  abstract getCustomerFilterTemplate (id: number): Observable<CustomerFilterTemplate>;
  abstract getCustomerFilterTemplates (): Observable<CustomerFilterTemplate[]>;

  /** Customer filter template Questions */
  abstract getCustomerFilterTemplateQuestions(filterTemplate?: string): Observable<QuestionBase[]>;
}
