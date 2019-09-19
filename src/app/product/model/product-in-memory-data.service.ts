import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Product } from './product';
import { ProductFilterTemplate } from './product-filter-template';

import { mockProducts } from './mock-products';
import { mockProductFilterTemplates } from './mock-product-filter-templates';

@Injectable()
export class ProductInMemoryDataService implements InMemoryDbService {
  createDb() {

    const products: Product[] = mockProducts;

    const productFilterTemplates: ProductFilterTemplate[] = mockProductFilterTemplates;

    return { products, productFilterTemplates };
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.

  // genId(heroes: Hero[]): number {
  //   return heroes.length > 0
  //     ? Math.max(...heroes.map(hero => hero.id)) + 1
  //     : 11;
  // }

  // genId(products: Product[]): number {
  //   return products.length > 0
  //   ? Math.max(...products.map(product => product.id)) + 1
  //   : 20000;
  // }

  genId(templates: ProductFilterTemplate[]): number {
    return templates.length > 0
    ? Math.max(...templates.map(template => template.id)) + 1
    : 1;
  }
}
