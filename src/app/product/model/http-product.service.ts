import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, forkJoin, of } from 'rxjs';
import { tap, mergeMap, catchError, switchMap } from 'rxjs/operators';

import { Product } from './product';
import { ProductService } from './product.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { UtilsService } from '../../shared/utils.service';
import { MessageService } from '../../shared/message.service';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';


/**
 * Service for accessing and maintaining products
 * on a remote http server (via HTTP REST API).
 * ####################################################################
 * Implements the ProductService interface.
 *
 * - See also https://github.com/angular/in-memory-web-api/blob/master/src/app/http-client-hero.service.ts
 */

@Injectable()
export class HttpProductService extends ProductService {

  /** Http REST API */
  private productsUrl = 'api/products';

  /** Http Header for create/update/delete methods */
  private cudOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };


  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandler,
    private httpUtils: UtilsService,
    private messageService: MessageService,
  ) {
    super();
  }


  /**
   * Creating a product on the remote http server.
   * ##################################################################
   *
   * HTTP POST - ?Response (with the generated product.id) expected.
   */

  createProduct(product: Product): Observable<Product> {

    // ===============================================================
    // Client side auto generating product id (should be done server side).
    // Remove this for real server implementation.
    // ===============================================================
    const queryParams = new QueryParams();
    queryParams.pageSize = 9999;
    //  queryParams.sortField = 'id';
    //  queryParams.sortOrder = 'desc';

    // Getting all products.
    return this.getProducts(queryParams)
      .pipe(
        switchMap(res => {
          // Returns the highest product id + 1
          product.id = Math.max(...res.items.map(item => item.id)) + 1;

          const message = `Product with id = ${product.id} and name = "${product.name}" has been created.`;

          return this.http.post<Product>(this.productsUrl, product, this.cudOptions)
            .pipe(
              tap(() => this.showMessage(message)),
              tap(() => this.logMessage(`[createProduct()] ${message}`)),
              catchError(this.handleError<Product>(message.replace('has been', 'can not be'))),
            );
        })

      );





  }


  /**
   * Deleting a product on the remote http server.
   * ##################################################################
   * Returns an empty object.
   *
   * HTTP DELETE - Null response expected.
   */

  deleteProduct(id: number): Observable<{}> {

    const message = `Product ${id} deleted.`;

    return this.http.delete(this.productsUrl + `/${id}`, this.cudOptions)
      .pipe(
        tap(() => this.showMessage(message)),
        tap(() => this.logMessage(message)),
        catchError(this.handleError<Product>(`Product ${id} can not be deleted.`)),
      );
  }


  /**
   * Deleting multiple products with the selected ids.
   * ##################################################################
   * Returns an empty object.
   *
   * HTTP DELETE - Null response expected.
   */

  deleteProducts(ids: number[] = []): Observable<any> {

    const message = ids.length > 1 ?
      `Selected ${ids.length} products deleted.` :
      `Product ${ids[0]} deleted.`;
    const tasks$ = [];

    for (let i = 0; i < ids.length; i++) {
      tasks$.push(this.deleteOneProduct(ids[i]));
    }

    return forkJoin(tasks$)
      .pipe(
        tap(() => this.showMessage(message)),
        tap(() => this.logMessage(message)),
        catchError(this.handleError<Product>('deleteProducts(ids)')),
      );

  }


  /** Delete one product. */
  private deleteOneProduct(id: number): Observable<any> {

    return this.http.delete(this.productsUrl + `/${id}`, this.cudOptions);

  }


  /**
   * Getting a product from the remote http server.
   * ##################################################################
   */

  getProduct(id: number): Observable<Product> {

    return this.http.get<Product>(this.productsUrl + `/${id}`)
      .pipe(
        catchError(this.handleError<Product>(`Get product id=${id}`))
      );
  }


  /**
   * Getting products from the remote http server.
   * ##################################################################
   *
   * @param queryParams   The filter, sort, and page parameters.
   * @return queryResult  The filtered and sorted items (product) array.
   *
   * The server should perform filtering, sorting, and paginating
   * and return the proper queryResult.
   *
   * This code emulates real server response by getting all products from
   * the server and performing client-side filtering, sorting, and paginating
   * (done in the ProductDatasource class).
   * Change this for real server implementation.
   *
   *
   * getProducts() returns a QueryResult Observable;
   * http.get()     returns a Product[] Observable.
   *
   * - mergeMap
   *   maps each value (Product[]) emitted by the source observable
   *   to a new observable (queryResult) which is merged in the output observable.
   * - switchMap
   *   maps the *most recent*  value (Product[]) emitted by source observable
   *   to a new observable (queryResult) which is merged in the output observable.
   *   It switches whenever a new value is emitted.
   */

  getProducts(queryParams?: QueryParams): Observable<QueryResult> {

    // Getting all products.
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        switchMap(res => {
          const queryResult = new QueryResult();
          queryResult.items = res;
          queryResult.totalCount = res.length;

          // Setting client-side querying
          // (searching/filtering/sorting/paging).
          // ==========================================================
          queryResult.clientSideQuerying = true;

          return of(queryResult);
        }),
        catchError(this.handleError<QueryResult>('http.get in getProducts(queryParams)'))
      );



    // if (!queryParams) { queryParams = new QueryParams(); }

    // if (queryParams.searchTerm) {

    //   this.logMessage(
    //     `[getProducts(queryParams) / searchTerm] queryParams = \n ${JSON.stringify(queryParams)}`
    //   );

    //   // Search term (for searching in all fields) is set.
    //   return this.http.get<Product[]>(this.productsUrl)
    //     .pipe(
    //       switchMap(res => {
    //         // ===============================================================
    //         // Client side searching (should be done server side).
    //         // Remove this for real server implementation.
    //         // ===============================================================
    //         const queryResult = this.httpUtils.searchInAllFields(res, queryParams);
    //         // ===============================================================
    //         return of(queryResult);
    //       }),
    //       catchError(this.handleError<QueryResult>('http.get in getProducts(queryParams.searchTerm)'))
    //     );

    // } else {

    //   this.logMessage(
    //     `[getProducts(queryParams) / filters] queryParams = \n ${JSON.stringify(queryParams)}`
    //   );

    //   // Filters are set (or empty = select all).
    //   return this.http.get<Product[]>(this.productsUrl)
    //     .pipe(
    //       switchMap(res => {
    //         // ===============================================================
    //         // Client side filtering and sorting (should be done server side).
    //         // Remove this for real server implementation.
    //         // ===============================================================
    //         const queryResult = this.httpUtils.filterAndSort(res, queryParams);
    //         // ===============================================================
    //         return of(queryResult);
    //       }),
    //       catchError(this.handleError<QueryResult>('http.get in getProducts(queryParams)'))
    //     );

    // }

  }


  /**
   * Updating a product on the remote http server.
   * ##################################################################
   * Returns the updated product upon success.
   *
   * HTTP PUT - Null response expected.
   */

  updateProduct(product: Product): Observable<Product> {
    // const httpHeader = this.httpUtils.getHttpHeaders();

    const message = `Product with id = ${product.id} and name = "${product.name}" has been updated.`;

    return this.http.put<Product>(this.productsUrl, product, this.cudOptions)
      .pipe(
        tap(() => this.showMessage(message)),
        tap(() => this.logMessage(message)),

        catchError(this.handleError<Product>(message.replace('has been', 'can not be'))),
      );
  }



  // ##################################################################
  // Non public helper methods.
  // ##################################################################


  /** Handling http errors. */
  private handleError<T>(operationFailed: string) {
    return this.httpErrorHandler.handleError<T>('http-product.service.ts', operationFailed);
  }

  /** Logging message to console. */
  private logMessage(message: string) {
    return this.messageService.logMessage('[########## http-product.service.ts ##########] ' + message);
  }

  /** Showing user friendly message. */
  private showMessage(message: string) {
    return this.messageService.showMessage(message);
  }


}
