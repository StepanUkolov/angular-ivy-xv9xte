import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IdentityService } from '../../../providers/services/identity.service';
import { FormBaseComponent } from '../../../shared/components/form.base.component';
import { IdentityClient } from '../../../web-api-client';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent extends FormBaseComponent implements OnInit {

  constructor(private identityClient: IdentityClient,
    private identityService: IdentityService,
    fb: FormBuilder) {
    super(fb);
  }

  ngOnInit(): void {
    this.initialForm();
  }


  submit() {
    if (this.form.invalid) return false;

    this.identityClient.changePassword(this.identityService.userId, this.form.get("password").value).subscribe(res => {
      console.log(res);
    });
  }


  private initialForm() {
    this.form = this.fb.group({
      password: new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_-]{8,30}$/)])),
    });
  }
}
