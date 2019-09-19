// C:\Users\gfranke\dev\angular\ang-http-client-7.1.4\src\app\heroes\heroes.service.spec.ts

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Product } from './product';
import { HttpProductService } from './http-product.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { MessageService } from '../../shared/message.service';

import { mockProducts } from '../model/mock-products';
import { QueryResult } from '../../shared/query-result';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Overlay } from '@angular/cdk/overlay';

// const products = mockProducts;

/**
 * ####################################################################
 * HttpProductService
 * ####################################################################
 */
describe('HttpProductService:', () => {


  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let productService: HttpProductService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  let testUrl: string;


  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    TestBed.configureTestingModule({
      // Import the HttpClient mocking services.
      imports: [HttpClientTestingModule],
      // Provide both the service-under-test and its (spy) dependencies.
      providers: [
        HttpProductService,
        { provide: MatSnackBar, useValue: spy }
        // HttpErrorHandler,
        // MessageService,
        // MatSnackBar,
        // Overlay
      ]
    });

    // Inject the http and test controller.
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);

    // Inject both the service-under-test and its (spy) dependencies.
    productService = TestBed.get(HttpProductService);
    snackBarSpy = TestBed.get(MatSnackBar);

    testUrl = productService.productsUrl;
  });


  afterEach(() => {
    // Verifying that no requests remain outstanding.
    httpTestingController.verify();
  });



  /**
   * ##################################################################
   * HttpProductService: Get product by id:
   * ##################################################################
   */
  describe('Get product by id: ', () => {

  });



  /**
   * ##################################################################
   * HttpProductServiceSpec: Get all products (no QueryParams):
   * ##################################################################
   */
  describe('Get all products (no QueryParams):', () => {
    // let expectedQueryResult: QueryResult;

    const expectedQueryResult = {
      items: mockProducts,
      totalCount: 0,
      errorMessage: ''
    } as QueryResult;

    const emptyQueryResult = {
      items: [],
      totalCount: 0,
      errorMessage: ''
    } as QueryResult;

    const expectedQueryResult1 = {
      items: [mockProducts[0]],
      totalCount: 1,
      errorMessage: ''
    } as QueryResult;

    const expectedQueryResult2 = {
      items: [mockProducts[0], mockProducts[1]],
      totalCount: 2,
      errorMessage: ''
    } as QueryResult;

    // beforeEach(() => {
    // });


    // it('Should return expected query result (called once)', () => {
    it('Should return expected products (called once).', () => {

      productService.getProducts().subscribe(
        res => expect(res.items).toEqual(expectedQueryResult.items, 'should return expected products'),
        fail
      );
      // ProductService should have made one http request to GET products.
      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('GET');
      // Respond with expected products.
      req.flush(expectedQueryResult.items);
    });


    it('Should be OK returning no products.', () => {

      productService.getProducts().subscribe(
        res => expect(res.items.length).toEqual(0, 'should have empty products array'),
        fail
      );
      const req = httpTestingController.expectOne(testUrl);
      // Respond with no products.
      req.flush(emptyQueryResult.items);
    });


    it('Should turn 404 http error into empty QueryResult.', () => {

      const emsg = '404 Page Not Found error';
      productService.getProducts().subscribe(
        res => expect(res.items.length).toEqual(0, 'should return empty QueryResult'),
        fail
        // res => fail('should have failed'),
        // error => expect(error.message).toContain(emsg)
      );
      const req = httpTestingController.expectOne(testUrl);
      // Respond with 404 and the error message in the body.
      req.flush(emsg, { status: 404, statusText: 'Not Found' });

    });


    it('Should return expected products (called multiple times).', () => {
      productService.getProducts().subscribe();
      productService.getProducts().subscribe();
      productService.getProducts().subscribe(
        res => expect(res.items).toEqual(expectedQueryResult.items, 'should return expected products'),
        fail
      );
      const requests = httpTestingController.match(testUrl);
      expect(requests.length).toEqual(3, 'calls to getProducts()');
      // Respond to each request with different expected product results
      requests[0].flush(emptyQueryResult.items);
      requests[1].flush(expectedQueryResult1.items);
      requests[2].flush(expectedQueryResult.items);
    });
  });


  /**
   * ##################################################################
   * HttpProductServiceSpec: Update product:
   * ##################################################################
   */
  describe('UpdateProduct:', () => {


    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${testUrl}/?id=${id}`;
    const product: Product = mockProducts[0]; // { id: 1, name: 'A' };


    it('Should update a product and return it.', () => {

      productService.updateProduct(product).subscribe(
        res => expect(res).toEqual(jasmine.objectContaining({ id: res.id }), 'should return the product'),
        fail
      );
      // ProductService should have made one request to PUT product
      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(product);
      // Expect server to return the product after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: product });

      req.event(expectedResponse);
    });


    it('Should turn 404 error into return of the updated product.', () => {

      const emsg = '404 Page Not Found error';
      productService.updateProduct(product).subscribe(
        res => expect(res).toEqual(product, 'should return the product'),
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


  // TODO: test other ProductService methods

});
