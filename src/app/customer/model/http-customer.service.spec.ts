// C:\Users\gfranke\dev\angular\ang-http-client-7.1.4\src\app\heroes\heroes.service.spec.ts

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Customer } from './customer';
import { HttpCustomerService } from './http-customer.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { MessageService } from '../../shared/message.service';

import { mockCustomers } from '../model/mock-customers';
import { QueryResult } from '../../shared/query-result';

// const customers = mockCustomers;

/**
 * ####################################################################
 * Test HttpCustomerService
 * ####################################################################
 */
describe('#HttpCustomerService', () => {


  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let customerService: HttpCustomerService;
  let testUrl: string;


  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services.
      imports: [HttpClientTestingModule],
      // Provide the service-under-test and its dependencies.
      providers: [
        HttpCustomerService,
        HttpErrorHandler,
        MessageService
      ]
    });

    // Inject the http, test controller, and service-under-test.
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    customerService = TestBed.get(HttpCustomerService);

    testUrl = customerService.customersUrl;
  });


  afterEach(() => {
    // Verifying that no requests remain outstanding.
    httpTestingController.verify();
  });



  /**
   * ##################################################################
   * Test HttpCustomerService - getCustomer(id)
   * ##################################################################
   */
   describe('#get customer by ID', () => {

   });



  /**
   * ##################################################################
   * Test HttpCustomerService - getCustomers()
   * ##################################################################
   */
  describe('#get all customers - No QueryParams', () => {
    // let expectedQueryResult: QueryResult;

    const expectedQueryResult = {
      items: mockCustomers,
      totalCount: 0,
      errorMessage: ''
    } as QueryResult;

    const noQueryResult = {
      items: [],
      totalCount: 0,
      errorMessage: ''
    } as QueryResult;

    const expectedQueryResult1 = {
      items: [mockCustomers[0]],
      totalCount: 1,
      errorMessage: ''
    } as QueryResult;

    const expectedQueryResult2 = {
      items: [mockCustomers[0], mockCustomers[1]],
      totalCount: 2,
      errorMessage: ''
    } as QueryResult;

    // beforeEach(() => {
       // });


    // it('#should return expected query result (called once)', () => {
    it('#should return expected customers (called once)', () => {

      customerService.getCustomers().subscribe(
        res => expect(res.items).toEqual(expectedQueryResult.items, 'should return expected customers'),
        fail
      );
      // CustomerService should have made one http request to GET customers.
      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('GET');
      // Respond with expected customers.
      req.flush(expectedQueryResult.items);
    });


    it('#should be OK returning no customers', () => {

      customerService.getCustomers().subscribe(
        res => expect(res.items.length).toEqual(0, 'should have empty customers array'),
        fail
      );
      const req = httpTestingController.expectOne(testUrl);
      // Respond with no customers.
      req.flush(noQueryResult.items);
    });


    it('#should turn 404 http error into empty customer array', () => {

      const emsg = '404 Page Not Found error';
      customerService.getCustomers().subscribe(
        res => expect(res.items.length).toEqual(0, 'should return empty customer array'),
        fail
        // res => fail('should have failed'),
        // error => expect(error.message).toContain(emsg)
      );
      const req = httpTestingController.expectOne(testUrl);
      // Respond with 404 and the error message in the body.
      req.flush(emsg, { status: 404, statusText: 'Not Found' });

    });


    it('#should return expected customers (called multiple times)', () => {
      customerService.getCustomers().subscribe();
      customerService.getCustomers().subscribe();
      customerService.getCustomers().subscribe(
        res => expect(res.items).toEqual(expectedQueryResult.items, 'should return expected customers'),
        fail
      );
      const requests = httpTestingController.match(testUrl);
      expect(requests.length).toEqual(3, 'calls to getCustomers()');
      // Respond to each request with different expected customer results
      requests[0].flush(noQueryResult.items);
      requests[1].flush(expectedQueryResult1.items);
      requests[2].flush(expectedQueryResult.items);
    });
  });


  /**
   * ##################################################################
   * Test HttpCustomerService - updateCustomer()
   * ##################################################################
   */
  describe('#updateCustomer', () => {


    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${testUrl}/?id=${id}`;
    const customer: Customer = mockCustomers[0]; // { id: 1, name: 'A' };


    it('#should update a customer and return it', () => {

      customerService.updateCustomer(customer).subscribe(
        res => expect(res).toEqual(customer, 'should return the customer'),
        fail
      );
      // CustomerService should have made one request to PUT customer
      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(customer);
      // Expect server to return the customer after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: customer });

      req.event(expectedResponse);
    });


    it('#should turn 404 error into return of the updated customer', () => {

      const emsg = '404 Page Not Found error';
      customerService.updateCustomer(customer).subscribe(
        res => expect(res).toEqual(customer, 'should return the customer'),
        fail
        // res => fail('should have failed'),
        // (error: HttpErrorResponse) => {
        //   expect(error.status).toEqual(404, 'status');
        //   expect(error.error).toEqual(emsg, 'message');
      );
      const req = httpTestingController.expectOne(testUrl);
      // respond with a 404 and the error message in the body
      req.flush(emsg, { status: 404, statusText: 'Not Found' });
    });


  });


  // TODO: test other CustomerService methods

});
