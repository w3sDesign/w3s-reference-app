/**
 * Based on https://github.com/angular/in-memory-web-api
 * /src/app/hero.service.spec.ts
 *
 */

 import { async, TestBed } from '@angular/core/testing';

import { concatMap, tap, map } from 'rxjs/operators';


import { Product } from './product';
import { ProductService } from './product.service';



// import { failure } from '../testing';
export function failure(err: any) {
  fail(JSON.stringify(err));
}

/**
 * Common tests for the ProductService, whether implemented with Http or HttpClient
 * Assumes that TestBed has been configured appropriately before created and run.
 *
 * Tests with extended test expirations accommodate the default (simulated) latency delay.
 * Ideally configured for short or no delay.
 */
export class ProductServiceCoreSpec {

  run() {

    describe('ProductService core', () => {

      let productService: ProductService;

      beforeEach(function() {
        productService = TestBed.get(ProductService);
      });

      // it('can get products', async(() => {
      //   productService.getProducts()
      //     .subscribe(
      //     products => {
      //       // console.log(products);
      //       expect(products.length).toBeGreaterThan(0, 'should have products');
      //     },
      //     failure
      //     );
      // }));

      it('can get product w/ id=1', async(() => {
        productService.getProduct(1)
          .subscribe(
          product => {
            // console.log(product);
            expect(product.name).toBe('Windstorm');
          },
          () => fail('getProduct failed')
          );
      }));

      // it('should 404 when product id not found', async(() => {
      //   const id = 123456;
      //   productService.getProduct(id)
      //     .subscribe(
      //     () => fail(`should not have found product for id='${id}'`),
      //     err => {
      //       expect(err.status).toBe(404, 'should have 404 status');
      //     }
      //     );
      // }));

      // it('can add a product', async(() => {
      //   productService.createProduct('FunkyBob').pipe(
      //     tap(product => {
      //       // console.log(product);
      //       expect(product.name).toBe('FunkyBob');
      //     }),
      //     // Get the new product by its generated id
      //     concatMap(product => productService.getProduct(product.id)),
      //   ).subscribe(
      //     product => {
      //       expect(product.name).toBe('FunkyBob');
      //     },
      //     err => failure('re-fetch of new product failed')
      //     );
      // }), 10000);

      // it('can delete a product', async(() => {
      //   const id = 1;
      //   productService.deleteProduct(id)
      //     .subscribe(
      //     (_: {}) => {
      //       expect(_).toBeDefined();
      //     },
      //     failure
      //     );
      // }));

      // it('should allow delete of non-existent product', async(() => {
      //   const id = 123456;
      //   productService.deleteProduct(id)
      //     .subscribe(
      //     (_: {}) => {
      //       expect(_).toBeDefined();
      //     },
      //     failure
      //     );
      // }));

      // it('can search for products by name containing "a"', async(() => {
      //   productService.searchProducts('a')
      //     .subscribe(
      //     (products: Product[]) => {
      //       expect(products.length).toBe(3, 'should find 3 products with letter "a"');
      //     },
      //     failure
      //   );
      // }));

      // it('can update existing product', async(() => {
      //   const id = 1;
      //   productService.getProduct(id).pipe(
      //     concatMap(product => {
      //       product.name = 'Thunderstorm';
      //       return productService.updateProduct(product);
      //     }),
      //     concatMap(() => {
      //       return productService.getProduct(id);
      //     })
      //   ).subscribe(
      //     product => {
      //       console.log(product);
      //       expect(product.name).toBe('Thunderstorm');
      //     },
      //     err => fail('re-fetch of updated product failed')
      //     );
      // }), 10000);

      // it('should create new product when try to update non-existent product', async(() => {
      //   const falseProduct = new Product(12321, 'DryMan');

      //   productService.updateProduct(falseProduct)
      //     .subscribe(
      //     product => {
      //       expect(product.name).toBe(falseProduct.name);
      //     },
      //     failure
      //     );
      // }));

    });
 }
}
