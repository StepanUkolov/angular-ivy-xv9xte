import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent  {

  constructor(
    private dialogRef: MatDialogRef<ConfirmComponent>
  ) { }

  close() {
    this.dialogRef.close();
  }
}
