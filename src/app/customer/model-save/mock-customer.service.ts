import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { asyncData } from '../../../testing';

import { Customer } from '../model/customer';
import { CustomerService } from '../customer.service';
import { CustomerFilterTemplate } from '../model/customer-filter-template';


import { mockCustomers } from '../model/mock-customers';
import { mockCustomerFilterTemplates } from '../model/mock-customer-filter-templates';

import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';

import { QuestionBase } from '../../shared/dynamic-form/question-base';



/**
 * # Mock service for accessing and maintaining customers in-memory.
 * ####################################################################
 * Implements the CustomerService interface.
 *
 * See also: https://github.com/angular/angular/blob/master/aio/content/examples/testing/src/app/model/testing/test-hero.service.ts
 */

@Injectable()
export class MockCustomerService extends CustomerService {

  private customers: Customer[] = mockCustomers;
  private customerFilterTemplates: CustomerFilterTemplate[] = mockCustomerFilterTemplates;

  lastResult: Observable<any>;

  constructor() {
    super();
  }



  createCustomer(customer: Customer): Observable<Customer> {
    return this.lastResult = this.getCustomer(customer.id)
      .pipe(
        map(res => {
          if (res) { return Object.assign(res, customer); }
          throw new Error(`Customer ${customer.id} not found`);
        })
      );
  }



  getCustomer(id: number): Observable<Customer> {
    return this.lastResult = asyncData(this.customers[id]);
  }


  getCustomers(queryParams?: QueryParams): Observable<QueryResult> {
    const queryResult = new QueryResult();
    queryResult.items = this.customers;

    return this.lastResult = asyncData(queryResult);
  }



  updateCustomer(customer: Customer): Observable<Customer> {
    return this.lastResult = this.getCustomer(customer.id)
      .pipe(
        map(res => {
          if (res) { return Object.assign(res, customer); }
          throw new Error(`Customer ${customer.id} not found`);
        })
      );
  }


  deleteCustomer(id: number): Observable<{}> {
    return this.lastResult = this.getCustomer(id)
      .pipe(
        map(res => {
          if (res) { return {}; }
          throw new Error(`Customer ${id} not found`);
        })
      );
  }


  deleteCustomers(ids: number[] = []): Observable<any> {
    const message = ids.length > 1 ?
      `Seleted ${ids.length} customers deleted.` :
      `Customer ${ids[0]} deleted.`;

    for (let i = 0; i < ids.length; i++) {
      return this.deleteCustomer(ids[i]);
    }
  }


  /** Customer filter templates */
  /** Get all customer filter templates */
  getCustomerFilterTemplates(): Observable<CustomerFilterTemplate[]> {
    return this.lastResult = asyncData(this.customerFilterTemplates);
  }

  getCustomerFilterTemplate(id: number): Observable<CustomerFilterTemplate> {
    return this.lastResult = asyncData(this.customerFilterTemplates[0]);
  }

}
