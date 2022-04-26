import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormBaseComponent } from '../../../../shared/components/form.base.component';
import { BlockedWalletClient, CreateBlockedWallet } from '../../../../web-api-client';

@Component({
  selector: 'app-block-wallet-upsert',
  templateUrl: './block-wallet-upsert.component.html',
  styleUrls: ['./block-wallet-upsert.component.css']
})
export class BlockWalletUpsertComponent extends FormBaseComponent implements OnInit {



  constructor(
    fb: FormBuilder,
    private blockedWallets: BlockedWalletClient
  ) {
    super(fb)
  }

  ngOnInit(): void {
    this.initialForm()
  }
  submit() {
    if (this.form.invalid || this.form.pristine)
      return
    this._subs.add(
      this.blockedWallets.create(<CreateBlockedWallet>Object.assign(this.form.value))
        .subscribe(res => {
          if (res.succeeded) {
            this.submitted = false
            this.form.reset()
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
        Validators.required,
        Validators.maxLength(30)
      ])),
    });
  }
}
