/**
 *  Based on angular docu
 *  angular/aio/content/examples/http/src/app/http-error-handler.service.ts
 */

import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';

import { MessageSnackBarComponent } from './message-snack-bar/message-snack-bar.component';
import { MessageService } from './message.service';
import { MatSnackBar } from '@angular/material';


/**
 * ####################################################################
 * Handles HttpClient errors
 * ####################################################################
 */
@Injectable({ providedIn: 'root' })
export class HttpErrorHandler {

  constructor(
    private messageService: MessageService,
    private snackBar: MatSnackBar
  ) { }

  /**
   * Returns a function that handles Http operation failures.
   * This error handler lets the app continue to run as if no error occurred.
   * @param serviceName = name of the data service that attempted the operation
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {

    return (error: HttpErrorResponse): Observable<T> => {

      const message = (error.error instanceof ErrorEvent) ?
        // Client side error
        error.error.message :
        // Server side error
        `server returned code ${error.status} with body "${error.error}"`;

      // Showing the error.
      this.openSnackBar(message);

      // Logging the error.
      this.messageService.add(`${serviceName}: ${operation} failed: ${message}`);

      // console.log(message);

      // Let the app keep running by returning a safe (empty) result.
      return of(result);

      // return throwError(error);
    };

  }


  /**
   * ##################################################################
   * Helper functions
   * ##################################################################
   */

  /**
   * Showing the error for user consumation.
   */
  private openSnackBar(message: string) {
    this.snackBar.openFromComponent(MessageSnackBarComponent, {
      data: message,
      duration: 3000,
      verticalPosition: 'top',
      panelClass: 'w3s-snack-bar', // adds to snack-bar-container
    });
  }


  /**
   * Create a convenience handleError function that already
   * knows the service name.
   */
  createHandleError = (serviceName = '') => <T>
    (operation = 'operation', result = {} as T) => this.handleError(serviceName, operation, result)

}

/** Type of the convenience handleError function */
export type HandleError =
  <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;



