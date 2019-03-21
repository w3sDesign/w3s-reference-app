/**
 * ####################################################################
 * TODO SnackBar - see DELETE
 * ####################################################################
 *
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { tap, mergeMap, catchError } from 'rxjs/operators';

import { FilterTemplate } from './filter-template';
import { FilterTemplateService } from './filter-template.service';
import { HttpErrorHandler, HandleError } from '../../shared/http-error-handler.service';
import { HttpUtilsService } from '../../shared/http-utils.service';
import { MessageService } from '../../shared/message.service';
import { QueryParams } from '../../shared/query-params';
import { QueryResult } from '../../shared/query-result';

import { MatSnackBar } from '@angular/material';
import { MessageSnackBarComponent } from '../../shared/message-snack-bar/message-snack-bar.component';
import { Overlay } from '@angular/cdk/overlay';

/**
 * Re-exporting HttpFilterTemplateService as FilterTemplateService,
 * making client code independent of a concrete implementation
 * (by importing FilterTemplateService from http-filterTemplate.service).
 */
export { HttpFilterTemplateService as FilterTemplateService };


/** Headers for Create/Update/Delete methods */
const cudOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

/**
 * ####################################################################
 * Injectable http data access service (via HTTP REST API).
 *
 * See also angular/in-memory-web-api/src/app/http-client-hero.service.ts
 * ####################################################################
 */
@Injectable()
export class HttpFilterTemplateService extends FilterTemplateService {

  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandler,

    private httpUtils: HttpUtilsService,
    private messageService: MessageService,
    private snackBar: MatSnackBar,
    // private overlay: Overlay,
  ) {
    super();
    /** Create a convenience handleError function that already knows the service name.*/
    this.handleError = httpErrorHandler.createHandleError('HttpFilterTemplateService');
  }


  /**
   * ##################################################################
   * Get a filterTemplate by id from the remote http data server.
   * ##################################################################
   */
  getFilterTemplate(id: number): Observable<FilterTemplate> {
    return this.http.get<FilterTemplate>(this.filterTemplatesUrl + `/${id}`)
      .pipe(
        catchError(this.handleError<FilterTemplate>(`Get filterTemplate id=${id}`))
      );
  }


  /**
   * ##################################################################
   * Get filterTemplates from the remote http data server.
   *
   * This code emulates real server response (by getting all filterTemplates
   * and performing client-side filtering, sorting, and pagination).
   *
   * If no params specified, all filterTemplates are returned.
   *
   * Note: getFilterTemplates() returns QueryResult
   *       http.get()     returns FilterTemplate[]
   * ##################################################################
   */
  getFilterTemplates(queryParams?: QueryParams): Observable<QueryResult> {
    if (queryParams) {
      return this.http.get<FilterTemplate[]>(this.filterTemplatesUrl)
        .pipe(
          mergeMap(res => {
            const queryResult = this.httpUtils.filterAndSort(res, queryParams);
            return of(queryResult);
          }),
          catchError(this.handleError('getFilterTemplates with queryParams', new QueryResult()))
        );
    }

    // No queryParams, all filterTemplates returned.
    return this.http.get<FilterTemplate[]>(this.filterTemplatesUrl)
      .pipe(
        mergeMap(res => {
          const queryResult = new QueryResult();
          queryResult.items = res;
          queryResult.totalCount = queryResult.items.length;
          return of(queryResult);
        }),
        catchError(this.handleError('getFilterTemplates', new QueryResult()))
      );
  }


  /**
   * ##################################################################
   * TODO
   * ##################################################################
   */
  searchFilterTemplates(term: string): Observable<FilterTemplate[]> {
    term = term.trim();
    // add safe, encoded search parameter if term is present
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<FilterTemplate[]>(this.filterTemplatesUrl, options)
      .pipe(
        catchError(this.handleError<FilterTemplate[]>('Search filterTemplates'))
      );
  }


  /**
   * ##################################################################
   * Create a filterTemplate on the remote http data server.
   *
   * POST - FilterTemplate response (with the generated filterTemplate.id) expected.
   * ##################################################################
   */
  createFilterTemplate(filterTemplate: FilterTemplate): Observable<FilterTemplate> {
    return this.http.post<FilterTemplate>(this.filterTemplatesUrl, filterTemplate, cudOptions)
      .pipe(
        catchError(this.handleError<FilterTemplate>('Create filterTemplate')),
        // tap((cust: FilterTemplate) => this.log(`Create filterTemplate id=${cust.id}`))
      );
  }


  /**
   * ##################################################################
   * Update the filterTemplate on the remote data server.
   * Returns the updated filterTemplate upon success.
   *
   * PUT - Null response expected.
   * ##################################################################
   */
  updateFilterTemplate(filterTemplate: FilterTemplate): Observable<FilterTemplate> {
    // const httpHeader = this.httpUtils.getHttpHeaders();
    const message = `FilterTemplate ${filterTemplate.id} updated.`;
    return this.http.put<FilterTemplate>(this.filterTemplatesUrl, filterTemplate, cudOptions)
      .pipe(
        tap(() => this.openSnackBar(message)),
        tap(() => this.log(message)),
        catchError(this.handleError('updateFilterTemplate', filterTemplate)),
      );
  }


  /**
   * ##################################################################
   * Delete the filterTemplate from the remote data server.
   * Returns an empty object.
   *
   * DELETE - Null response expected.
   *
   * TODO: should we report filterTemplate.id NOT FOUND?
   * ##################################################################
   */
  deleteFilterTemplate(id: number): Observable<{}> {
    const message = `FilterTemplate ${id} deleted.`;
    return this.http.delete(this.filterTemplatesUrl + `/${id}`, cudOptions)
      .pipe(
        tap(() => this.openSnackBar(message)),
        tap(() => this.log(message)),
        catchError(this.handleError('deleteFilterTemplate')),
      );
  }


  /**
   * ##################################################################
   * Delete multiple filterTemplates.
   * ##################################################################
   */
  deleteFilterTemplates(ids: number[] = []): Observable<any> {
    const message = ids.length > 1 ?
      `Seleted ${ids.length} filterTemplates deleted.` :
      `FilterTemplate ${ids[0]} deleted.`;
    const tasks$ = [];
    for (let i = 0; i < ids.length; i++) {
      tasks$.push(this.deleteOneFilterTemplate(ids[i]));
    }
    return forkJoin(tasks$)
      .pipe(
        tap(() => this.openSnackBar(message)),
        tap(() => this.log(message)),
        catchError(this.handleError('deleteFilterTemplates')),
      );

  }

  private deleteOneFilterTemplate(id: number): Observable<any> {
    return this.http.delete(this.filterTemplatesUrl + `/${id}`, cudOptions);
  }





  /**
   * ##################################################################
   * Helper functions
   * ##################################################################
   */
  private openSnackBar(message: string) {
    this.snackBar.openFromComponent(MessageSnackBarComponent, {
      data: message,
      duration: 3000,
      verticalPosition: 'top',
      panelClass: 'w3s-snack-bar', // adds to snack-bar-container
    });
  }

  private openSnackBarSimple(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: 'w3s-snack-bar', /* added to snack-bar-container */
    });
  }


  /** Log a FilterTemplateService message */
  private log(message: string) {
    this.messageService.add('HttpFilterTemplateService: ' + message);
    // console.log('FilterTemplateService: ' + message);
  }




  // UPDATE Status
  // updateStatusForFilterTemplate(
  //   filterTemplates: FilterTemplate[],
  //   status: number
  // ): Observable<any> {
  //   const tasks$ = [];
  //   for (let i = 0; i < filterTemplates.length; i++) {
  //     const filterTemplate = filterTemplates[i];
  //     filterTemplate.status = status;
  //     tasks$.push(this.updateFilterTemplate(filterTemplate));
  //   }
  //   return forkJoin(tasks$);


}
