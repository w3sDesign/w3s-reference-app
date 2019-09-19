
import { Product } from './product';
import { Observable } from 'rxjs';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';

import { ProductFilterTemplate } from './product-filter-template';
import { QuestionBase } from '../../shared/dynamic-form/question-base';

/**
 * Service interface for accessing and maintaining product filter templates.
 * ####################################################################
 * 100% abstract class (= interface)
 */

export abstract class ProductFilterTemplateService {

  /** Create the specified product filter template. */
  abstract createProductFilterTemplate(filterTemplate: ProductFilterTemplate): Observable<ProductFilterTemplate>;

  /** Get the product filter template with the specified id. */
  abstract getProductFilterTemplate(id: number): Observable<ProductFilterTemplate>;

  /** Get all product filter templates. */
  abstract getProductFilterTemplates(): Observable<ProductFilterTemplate[]>;

  /** Update the specified product filter template. */
  abstract updateProductFilterTemplate(filterTemplate: ProductFilterTemplate): Observable<ProductFilterTemplate>;

}
