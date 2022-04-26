import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidatioNPatterns } from '../../../../core/Validators/ValidationPatterns';
import { FormBaseComponent } from '../../../../shared/components/form.base.component';
import { CreatePromocode, PromocodeClient } from '../../../../web-api-client';

@Component({
  selector: 'app-promocode-upsert',
  templateUrl: './promocode-upsert.component.html',
  styleUrls: ['./promocode-upsert.component.css']
})
export class PromocodeUpsertComponent extends FormBaseComponent implements OnInit {


  constructor(
    fb: FormBuilder,
    private promocodeClient: PromocodeClient
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
      this.promocodeClient.create(<CreatePromocode>Object.assign(this.form.value))
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
      code: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(30)
      ])),
      bonus: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(ValidatioNPatterns.onlyPositiveDigits)
      ])),
      activeFrom: ['', Validators.compose([
        Validators.required,
        Validators.pattern(ValidatioNPatterns.onlyPositiveDigits)
      ])],
    });
  }
}
