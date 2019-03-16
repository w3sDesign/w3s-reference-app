import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss']
})
export class InputDialogComponent {

  constructor(

    public dialogRef: MatDialogRef<InputDialogComponent>,

    // data object from open.dialog(): data = { xx }
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
