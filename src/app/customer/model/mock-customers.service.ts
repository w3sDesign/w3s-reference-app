import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { asyncData } from '../../../testing';

import { map } from 'rxjs/operators';

//////////////////////////////////////////////
// re-export for tester convenience
// export { Customer } from './customer';

// export { HttpCustomerService } from './http-customer.service';

// export { getTestCustomers } from './test-customers';
////////////////////////////////////////////////

import { Customer } from './customer';

import { HttpCustomerService as CustomerService } from './http-customer.service';

// import { getTestCustomers } from './test-customers';
import { mockCustomers } from '../model/mock-customers';



@Injectable()
/**
 * FakeCustomerService pretends to make real http requests.
 * implements only as much of CustomerService as is actually consumed by the app
*/
export class MockCustomersService extends CustomerService {

  constructor() {
    super(null, null, null);
  }

  customers = mockCustomers;

  lastResult: Observable<any>; // result from last method call

  addCustomer(customer: Customer): Observable<Customer> {
    throw new Error('Method not implemented.');
  }

  deleteCustomer(customer: number | Customer): Observable<Customer> {
    throw new Error('Method not implemented.');
  }

  getCustomers(): Observable<any> {
    return this.lastResult = asyncData(this.customers);
  }

  getCustomer(id: number | string): Observable<Customer> {
    if (typeof id === 'string') {
      id = parseInt(id as string, 10);
    }
    const customer = this.customers.find(h => h.id === id);
    return this.lastResult = asyncData(customer);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.lastResult = this.getCustomer(customer.id).pipe(
      map(h => {
        if (h) {
          return Object.assign(h, customer);
        }
        throw new Error(`Customer ${customer.id} not found`);
      })
    );
  }
}
