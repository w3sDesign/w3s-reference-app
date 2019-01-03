import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-message-snack-bar-component',
  templateUrl: './message-snack-bar.component.html',
  styleUrls: ['./message-snack-bar.component.css']
})
export class MessageSnackBarComponent {
  constructor(public snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 500
    });
  }
}
