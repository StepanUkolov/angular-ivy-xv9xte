import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Msg } from '../../core/constants/ValidationMsg';
import { BaseComponent } from './base.component';
@Component({
  selector: 'form-base',
  template: ""
})
export class FormBaseComponent extends BaseComponent  {

  ValidationMessages = Msg
  form: FormGroup
  submitted: boolean = false
  errors=[]

  constructor(
    protected fb: FormBuilder
  ) {
    super()
  }

  protected serverErrorHandler(error: any) {
    if (!error.errors) return;
    Object.keys(error.errors).map((key) => {
      let lowerCaseKey = this.capitalizeFirstLetter(key);
      this.form.get(lowerCaseKey)?.setErrors({ serverError: true, message: error.errors[key[0].toUpperCase() + key.substr(1)] });
    })
  }

  private capitalizeFirstLetter = (string) => {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }

}
