import { Product } from './product';
import { Observable } from 'rxjs';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';


/**
 * Service interface for accessing and maintaining products.
 * ####################################################################
 * 100% abstract class (= interface).
 */

export abstract class ProductService {

  /** Get the product with the specified id. */
  abstract getProduct(id: number): Observable<Product>;

  /** Get the products with the specified QueryParams. */
  abstract getProducts(queryParams?: QueryParams): Observable<QueryResult>;

  /** Create the specified product. */
  abstract createProduct(product: Product): Observable<Product>;

  /** Update the specified product. */
  abstract updateProduct(product: Product): Observable<Product>;

  /** Delete the product with the specified id. */
  abstract deleteProduct(id: number): Observable<{}>;

  abstract deleteProducts(ids: number[]): Observable<{}>;

}
