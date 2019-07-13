import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageSnackBarComponent } from './message-snack-bar/message-snack-bar.component';

/**
 * Service for logging/showing messages.
 * ####################################################################
 */

 @Injectable({ providedIn: 'root' })
export class MessageService {

  // messages: string[] = [];
  nextId = 1;

  constructor(
    private snackBar: MatSnackBar
  ) { }


  /** Logging message to console. */
  logMessage(message: string) {
    // if (this.showTestValues) {
    if (!environment.production) {
      console.log(`%c#${this.nextId++}######### ${message}`, 'color: blue');
    }
  }


  /** Logging error message to console. */
  logErrorMessage(message: string) {
    if (!environment.production) {
      console.log('%c########## ' + message + ', color: darkred');
    }
  }


  /** Showing a user friendly message. */
  showMessage(message: string) {
    this.snackBar.openFromComponent(MessageSnackBarComponent, {
      data: message,
      duration: 5000,
      verticalPosition: 'top',
      // Extra CSS classes to be added to snack-bar-container.
      panelClass: 'w3s-snack-bar',
    });
  }


  /** Showing a user friendly error message. */
  showErrorMessage(message: string) {
    this.snackBar.openFromComponent(MessageSnackBarComponent, {
      data: message,
      duration: 5000,
      verticalPosition: 'top',
      // Extra CSS classes to be added to snack-bar-container.
      panelClass: 'w3s-snack-bar',
    });
  }


  // private openSnackBarSimple(message: string, action: string) {
  //   this.snackBar.open(message, action, {
  //     duration: 3000,
  //     verticalPosition: 'top',
  //     panelClass: 'w3s-snack-bar', /* added to snack-bar-container */
  //   });
  // }


  // add(message: string) {
  //   this.messages.push(message);
  // }

  // clear() {
  //   this.messages = [];
  // }
}
