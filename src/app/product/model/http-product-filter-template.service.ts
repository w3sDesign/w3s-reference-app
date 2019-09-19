import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, forkJoin, of } from 'rxjs';
import { tap, mergeMap, catchError, switchMap } from 'rxjs/operators';

import { ProductFilterTemplate } from './product-filter-template';
import { ProductFilterTemplateService } from './product-filter-template.service';

import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { UtilsService } from '../../shared/utils.service';
import { MessageService } from '../../shared/message.service';


/**
 * Service for accessing and maintaining product filter templates
 * on a remote http server (via HTTP REST API).
 * ####################################################################
 */

@Injectable()
export class HttpProductFilterTemplateService extends ProductFilterTemplateService {

  /** Http REST API */
  private productFilterTemplatesUrl = 'api/productFilterTemplates';

  /** Http Header for create/update/delete methods */
  private cudOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };


  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandler,
    private messageService: MessageService,
  ) {
    super();
  }


  /**
   * Create the specified product filter template on the http server.
   * ##################################################################
   * HTTP POST
   */

  createProductFilterTemplate(filterTemplate: ProductFilterTemplate): Observable<ProductFilterTemplate> {

    const message = `Filter template with id = ${filterTemplate.id} and name = "${filterTemplate.name}" has been created.`;

    return this.http.post<ProductFilterTemplate>(this.productFilterTemplatesUrl, filterTemplate, this.cudOptions)
      .pipe(
        tap(() => this.show(message)),
        tap(() => this.log(message)),
        catchError(this.handleError<ProductFilterTemplate>(message.replace('has been', 'can not be'))),
      );
  }


  /**
   * Get the product filter template with the specified id.
   * ##################################################################
   */

  getProductFilterTemplate(id: number): Observable<ProductFilterTemplate> {

    return this.http.get<ProductFilterTemplate>(this.productFilterTemplatesUrl + `/${id}`)
      .pipe(
        catchError(this.handleError<ProductFilterTemplate>(`Get productFilterTemplate id=${id}`))
      );
  }


  /**
   * Get all product filter templates.
   * ##################################################################
   */

  getProductFilterTemplates(): Observable<ProductFilterTemplate[]> {

    return this.http.get<ProductFilterTemplate[]>(this.productFilterTemplatesUrl)
      .pipe(
        catchError(this.handleError<ProductFilterTemplate[]>('getProductFilterTemplates()'))
      );
  }


  /**
   * Update the specified product filter template on the http server.
   * ##################################################################
   * HTTP PUT
   */

  updateProductFilterTemplate(productFilterTemplate: ProductFilterTemplate): Observable<ProductFilterTemplate> {

    const message = `ProductFilterTemplate with id = ${productFilterTemplate.id}
 and name = "${productFilterTemplate.name}" has been updated.`;

    return this.http.put<ProductFilterTemplate>(this.productFilterTemplatesUrl, productFilterTemplate, this.cudOptions)
      .pipe(
        tap(() => this.show(message)),
        tap(() => this.log(message)),

        catchError(this.handleError<ProductFilterTemplate>(message.replace('has been', 'can not be'))),
      );
  }



  // ##################################################################
  // Private helper methods.
  // ##################################################################


  /** Handling http errors. */
  private handleError<T>(operationFailed: string) {
    return this.httpErrorHandler.handleError<T>('http-product.service.ts', operationFailed);
  }

  /** Logging message to console. */
  private log(message: string) {
    return this.messageService.logMessage('[http-product.service.ts] ' + message);
  }

  /** Showing a user friendly message. */
  private show(message: string) {
    return this.messageService.showMessage(message);
  }


}
