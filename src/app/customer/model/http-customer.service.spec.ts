// C:\Users\gfranke\dev\angular\ang-http-client-7.1.4\src\app\heroes\heroes.service.spec.ts

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Other imports

import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Customer } from './customer';
import { HttpCustomerService } from './http-customer.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { MessageService } from '../../shared/message.service';



import { mockCustomers } from '../model/mock-customers';
import { MockCustomersService } from '../model//mock-customers.service';

const customers = mockCustomers;

/** Testing Vars */

describe('HttpCustomerService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let customerService: HttpCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [HttpClientTestingModule],
      // Provide the service-under-test and its dependencies
      providers: [
        HttpCustomerService,
        HttpErrorHandler,
        MessageService
      ]
    });

    // Inject the http, test controller, and service-under-test
    // as they will be referenced by each test.
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    customerService = TestBed.get(HttpCustomerService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  /// CustomerService method tests begin ///

  describe('#getCustomers', () => {
    let expectedCustomers: Customer[];

    beforeEach(() => {
      customerService = TestBed.get(HttpCustomerService);

      // expectedCustomers = [
      //   { id: 1, name: 'A' },
      //   { id: 2, name: 'B' },
      // ] as Customer[];

      expectedCustomers = [... customers];
    });

    it('should return expected customers (called once)', () => {

      customerService.getCustomers().subscribe(
        res => expect(res).toEqual(expectedCustomers, 'should return expected customers'),
        fail
      );

      // CustomerService should have made one request to GET customers from expected URL
      const req = httpTestingController.expectOne(customerService.customersUrl);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock customers
      req.flush(expectedCustomers);
    });

    it('should be OK returning no customers', () => {

      customerService.getCustomers().subscribe(
        res => expect(res.items.length).toEqual(0, 'should have empty customers array'),
        fail
      );

      const req = httpTestingController.expectOne(customerService.customersUrl);
      req.flush([]); // Respond with no customers
    });

    // This service reports the error but finds a way to let the app keep going.
    it('should turn 404 into an empty customers result', () => {

      customerService.getCustomers().subscribe(
        res => expect(res.items.length).toEqual(0, 'should return empty customers array'),
        fail
      );

      const req = httpTestingController.expectOne(customerService.customersUrl);

      // respond with a 404 and the error message in the body
      const msg = 'deliberate 404 error';
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return expected customers (called multiple times)', () => {

      customerService.getCustomers().subscribe();
      customerService.getCustomers().subscribe();
      customerService.getCustomers().subscribe(
        res => expect(res.items).toEqual(expectedCustomers, 'should return expected customers'),
        fail
      );

      const requests = httpTestingController.match(customerService.customersUrl);
      expect(requests.length).toEqual(3, 'calls to getCustomers()');

      // Respond to each request with different mock customer results
      requests[0].flush([]);
      requests[1].flush([{ id: 1, name: 'bob' }]);
      requests[2].flush(expectedCustomers);
    });
  });

  describe('#updateCustomer', () => {
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${customerService.customersUrl}/?id=${id}`;

    it('should update a customer and return it', () => {

      const updateCustomer: Customer = customers[0]; // { id: 1, name: 'A' };

      customerService.updateCustomer(updateCustomer).subscribe(
        data => expect(data).toEqual(updateCustomer, 'should return the customer'),
        fail
      );

      // CustomerService should have made one request to PUT customer
      const req = httpTestingController.expectOne(customerService.customersUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(updateCustomer);

      // Expect server to return the customer after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: updateCustomer });
      req.event(expectedResponse);
    });

    // This service reports the error but finds a way to let the app keep going.
    it('should turn 404 error into return of the update customer', () => {
      const updateCustomer: Customer = customers[0]; // { id: 1, name: 'A' };

      customerService.updateCustomer(updateCustomer).subscribe(
        data => expect(data).toEqual(updateCustomer, 'should return the update customer'),
        fail
      );

      const req = httpTestingController.expectOne(customerService.customersUrl);

      // respond with a 404 and the error message in the body
      const msg = 'deliberate 404 error';
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });

  // TODO: test other CustomerService methods
});
