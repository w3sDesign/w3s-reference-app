import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { asyncData } from '../../../testing';

import { Product } from './product';
import { ProductFilterTemplate } from './product-filter-template';

import { ProductService } from './product.service';

import { mockProducts } from './mock-products';
import { mockProductFilterTemplates } from './mock-product-filter-templates';

import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';

import { QuestionBase } from '../../shared/dynamic-form/question-base';



/**
 * # @class MockProductService
 * ####################################################################
 * - Is an injectable service that pretends to make real http requests.
 * - See also: https://github.com/angular/angular/blob/master/aio/content/examples/testing/src/app/model/testing/test-hero.service.ts
 */

@Injectable()
export class MockProductService { // TODOD    extends ProductService {

  private products: Product[] = mockProducts;
  private productFilterTemplates: ProductFilterTemplate[] = mockProductFilterTemplates;

  lastResult: Observable<any>;

  constructor() {
    // super();
  }



  getProduct(id: number): Observable<Product> {
    return this.lastResult = asyncData(this.products[id]);
  }


  getProducts(queryParams?: QueryParams): Observable<QueryResult> {
    const queryResult = new QueryResult();
    queryResult.items = this.products;

    return this.lastResult = asyncData(queryResult);
  }


  createProduct(product: Product): Observable<Product> {
    return this.lastResult = this.getProduct(product.id)
      .pipe(
        map(res => {
          if (res) { return Object.assign(res, product); }
          throw new Error(`Product ${product.id} not found`);
        })
      );
  }


  updateProduct(product: Product): Observable<Product> {
    return this.lastResult = this.getProduct(product.id)
      .pipe(
        map(res => {
          if (res) { return Object.assign(res, product); }
          throw new Error(`Product ${product.id} not found`);
        })
      );
  }


  deleteProduct(id: number): Observable<{}> {
    return this.lastResult = this.getProduct(id)
      .pipe(
        map(res => {
          if (res) { return {}; }
          throw new Error(`Product ${id} not found`);
        })
      );
  }


  deleteProducts(ids: number[] = []): Observable<any> {
    const message = ids.length > 1 ?
      `Seleted ${ids.length} products deleted.` :
      `Product ${ids[0]} deleted.`;

    for (let i = 0; i < ids.length; i++) {
      return this.deleteProduct(ids[i]);
    }
  }


  /** Product filter templates */
  /** Get all product filter templates */
  getProductFilterTemplates(): Observable<ProductFilterTemplate[]> {
    return this.lastResult = asyncData(this.productFilterTemplates);
  }

  getProductFilterTemplate(id: number): Observable<ProductFilterTemplate> {
    return this.lastResult = asyncData(this.productFilterTemplates[0]);
  }

}
