import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';

import { MessageSnackBarComponent } from './message-snack-bar/message-snack-bar.component';
import { MessageService } from './message.service';
import { MatSnackBar } from '@angular/material';



/**
 * Service for handling HTTP server errors.
 * ####################################################################
 *
 * - See also https://github.com/angular/in-memory-web-api/blob/master/src/app/http-client-hero.service.ts
 */

@Injectable({ providedIn: 'root' })
export class HttpErrorHandler {

  constructor(
    private messageService: MessageService,
  ) { }


  /**
   * Returns a function that handles Http operation failures.
   * ##################################################################
   * This error handler lets the app continue to run as if no error occurred.
   *
   * See also https://github.com/angular/angular/blob/master/aio/content/examples/http/src/app/http-error-handler.service.ts
   *
   * @param service     Name of the data service that attempted the operation.
   * @param operation   Name of the operation that failed.
   * @param result      Optional value to return as the observable result.
   */

  handleError<T>(service = 'service', operation = 'operation', result = {} as T) {

    return (error: HttpErrorResponse): Observable<T> => {

      const message = (error.error instanceof ErrorEvent)

        // Client side error
        ? error.error.message

        // Server side error
        // : `Server returned code ${error.status} (${error.statusText}) with body "${error.error}"`;
        : `Server returned code ${error.status} (${error.statusText}).`;

      // Showing the error message.
      // this.openSnackBar(message);
      this.show(message);

      // Logging the error message.
      // console.log(`%c########## [http-error-handler / handleError()] \n
      //   ${service}: ${operation} failed: \n*** ${message} ***`, 'color: red');
      this.log(`[http-error-handler / handleError()] \n
        ${service}: ${operation} failed: \n ${message}`);


      // return throwError(error);

      // Let the app keep running by returning a safe (empty) result.
      return of(result);

    };

  }


  // ##################################################################
  // Helpers
  // ##################################################################


  /**
 * Logging / showing messages.
 * ##################################################################
 * Delegating to the message service.
 */

  /** Logging error message to console. */
  private log(message: string) {
    return this.messageService.logMessage(message);
  }

  /** Showing a user friendly error message. */
  private show(message: string) {
    return this.messageService.showMessage(message);
  }

// Moved to message service
  // /** Showing a user friendly error message. */
  // private openSnackBar(message: string) {
  //   this.snackBar.openFromComponent(MessageSnackBarComponent, {
  //     data: message,
  //     duration: 5000,
  //     verticalPosition: 'top',
  //     panelClass: 'w3s-snack-bar', // adds to snack-bar-container
  //   });
  // }


  /** Create a convenience handleError function that already knows the service name. */
  // createHandleError = (service = '') => <T>
  //   (operation = 'operation', result = {} as T) => this.handleError(service, operation, result)

}


/** Type of the convenience handleError function */
// export type HandleError =
//   <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;



