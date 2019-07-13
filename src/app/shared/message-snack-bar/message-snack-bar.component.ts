import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-message-snack-bar',
  templateUrl: './message-snack-bar.component.html',
  styleUrls: ['./message-snack-bar.component.scss']
})
export class MessageSnackBarComponent {

  constructor(

    public snackBarRef: MatSnackBarRef<MessageSnackBarComponent>,

    // data object from open.snackBar(): data = { xx }
    @Inject(MAT_SNACK_BAR_DATA) public data: any

  ) { }

  onClick(): void {
    this.snackBarRef.dismiss();
  }
}
