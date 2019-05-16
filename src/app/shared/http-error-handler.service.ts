import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';

import { MessageSnackBarComponent } from './message-snack-bar/message-snack-bar.component';
import { MessageService } from './message.service';
import { MatSnackBar } from '@angular/material';



@Injectable({ providedIn: 'root' })
export class HttpErrorHandler {

  constructor(
    private messageService: MessageService,
    private snackBar: MatSnackBar
  ) { }


  /**
   * Returns a function that handles Http operation failures.
   * ##################################################################
   * This error handler lets the app continue to run as if no error occurred.
   * See also angular/aio/content/examples/http/src/app/http-error-handler.service.ts
   *
   * @param serviceName Name of the data service that attempted the operation
   * @param operation   Name of the operation that failed
   * @param result      Optional value to return as the observable result
   */
  handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {

    return (error: HttpErrorResponse): Observable<T> => {

      const message = (error.error instanceof ErrorEvent)
        // Client side error
        ? error.error.message
        // Server side error
        // : `Server returned code ${error.status} (${error.statusText}) with body "${error.error}"`;
        : `Server returned code ${error.status} (${error.statusText}).`;

      // Showing the error message.
      this.openSnackBar(message);

      // Logging the error message.
      this.messageService.add(`${serviceName}: ${operation} failed: ${message}`);

      // console.log(message);
      console.log(`%c########## ${serviceName}: ${operation} failed: \n*** ${message} ***`, 'color: blue');


      // Let the app keep running by returning a safe (empty) result.
      return of(result);

      // return throwError(error);
    };

  }


  // ##################################################################
  // Helper functions
  // ##################################################################


  /**
   * Showing a user friendly error message on a snack bar.
   */
  private openSnackBar(message: string) {
    this.snackBar.openFromComponent(MessageSnackBarComponent, {
      data: message,
      duration: 5000,
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



