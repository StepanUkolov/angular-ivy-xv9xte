import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormBaseComponent } from '../../../shared/components/form.base.component';
import { GeneralSettingClient, GeneralSettingDTO, UpdateGeneralSettingsCommand } from '../../../web-api-client';

@Component({
  selector: 'app-site-settings',
  templateUrl: './site-settings.component.html',
  styleUrls: ['./site-settings.component.css']
})
export class SiteSettingsComponent extends FormBaseComponent implements OnInit {
  taxValue: number
  minSummValue: number
  maxSummValue: number
  siteNameValue: string


  constructor(
    fb: FormBuilder,
    private siteSettings: GeneralSettingClient
  ) {
    super(fb)
  }
  ngOnInit(): void {
    this.initialForm();
    this.getSettings()
  }

  getSettings() {
    this.siteSettings.get().subscribe((res: GeneralSettingDTO) => {
      this.taxValue = res.exchangePercentage
      this.minSummValue = res.minValue
      this.maxSummValue = res.maxValue
      this.siteNameValue = res.siteName
    })
  }
  submit() {
    var a = new UpdateGeneralSettingsCommand();
    a.minValue = this.minSummValue;
    a.maxValue = this.maxSummValue;
    a.exchangePercentage = this.taxValue;
    a.siteName = this.siteNameValue;
    
    if (this.form.valid) {
      this.siteSettings.update(a).subscribe(res => {
        
      })
    }
  }
  private initialForm() {
    this.form = this.fb.group({
      tax: new FormControl("", Validators.compose([
        Validators.required
      ])),
      minSumm: new FormControl("", Validators.compose([
        Validators.required
      ])),
      maxSumm: new FormControl("", Validators.compose([
        Validators.required
      ])),
      siteName: new FormControl("", Validators.compose([
        Validators.required
      ])),
    });
  }
}
