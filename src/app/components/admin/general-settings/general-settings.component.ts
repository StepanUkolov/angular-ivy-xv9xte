import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ValidatioNPatterns } from '../../../core/Validators/ValidationPatterns';
import { FormBaseComponent } from '../../../shared/components/form.base.component';
import { GeneralSettingClient, UpdateGeneralSettingsCommand } from '../../../web-api-client';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css']
})
export class GeneralSettingsComponent extends FormBaseComponent implements OnInit {

  constructor(
    fb: FormBuilder,
    private generalSettingClient: GeneralSettingClient
  ) { super(fb) }

  ngOnInit(): void {
    this.initialForm()
  }

  submit() {
    if (this.form.invalid || this.form.pristine)
      return
    this._subs.add(
      this.generalSettingClient.update(<UpdateGeneralSettingsCommand>Object.assign(this.form.value))
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
      minValue: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(ValidatioNPatterns.onlyPositiveDigits)
      ])),
      maxValue: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(ValidatioNPatterns.onlyPositiveDigits)
      ])),
      exchangePercentage: ['', Validators.compose([
        Validators.required,
        Validators.pattern(ValidatioNPatterns.onlyPositiveDigits)
      ])],
      siteName: ['', Validators.compose([
        Validators.required
      ])],
    });
  }
}
