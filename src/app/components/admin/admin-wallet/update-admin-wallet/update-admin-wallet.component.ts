import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBaseComponent } from '../../../../shared/components/form.base.component';
import { AdminWalletClient, UpdateAdminWalletCommand } from '../../../../web-api-client';

@Component({
  selector: 'app-update-admin-wallet',
  templateUrl: './update-admin-wallet.component.html',
  styleUrls: ['./update-admin-wallet.component.css']
})
export class UpdateAdminWalletComponent extends FormBaseComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    fb: FormBuilder,
    private adminWalletClient: AdminWalletClient,
    private dialogRef: MatDialogRef<UpdateAdminWalletComponent>,
  ) {
    super(fb)
  }

  ngOnInit(): void {
    if (this.data != null) {
      this._subs.add(
        this.adminWalletClient.getById(this.data.id
        ).subscribe(reg => {
          this.form.patchValue(reg);
        })
      );
    }
    this.initialForm()
  }
  submit() {
    if (this.form.invalid || this.form.pristine) {
      return
    }
    this.submitted = true
    this._subs.add(
      this.adminWalletClient.update(<UpdateAdminWalletCommand>Object.assign({id: this.data?.id},this.form.value))
        .subscribe(res => {
          if (res.succeeded) {
            this.dialogRef.close(res.succeeded);
            this.submitted = false
          }
          else {
            this.submitted = false
          }

        },
          (error) => {
            this.serverErrorHandler(error)
            this.submitted = false
          }))
  }
  private initialForm() {
    this.form = this.fb.group({
      wallet: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

}
