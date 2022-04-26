import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { IdentityService } from "../../../providers/services/identity.service";
import {
  IdentityClient,
  ISignUpCommand,
  SignUpCommand,
} from "../../../web-api-client";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private identityClient: IdentityClient,
    private identityService: IdentityService,
    private router: Router,
    private dialogRef: MatDialogRef<SignUpComponent>,
  ) {}

  ngOnInit(): void {
    if (this.identityService.isAccessTokenValid())
      this.router.navigate(["Identity/Account"]);
    this.form = this.formBuilder.group(
      {

        allowTerms: ["", []],
        firstName: ["", [Validators.required]],
        lastName: ["", [Validators.required]],
        email: [
          "",
          {
            validaors: [
              Validators.required,
              Validators.email,
              Validators.minLength(5),
              Validators.maxLength(320),
            ],
            asyncValidators: [],
          },
        ],
        password: [
          "",
          [
            Validators.required,
            Validators.pattern(
              "(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}"
            ),
          ],
        ],
        confirmPassword: [
          "",
          [
            Validators.required,
            Validators.pattern(
              "(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}"
            ),
          ],
        ],
      },
      {
        validator: this.matchPasswords("password", "confirmPassword"),
      }
    );
  }

  onSubmit(email: string, password: string, passwordConfirm: string) {
    let signUpCommand: SignUpCommand = new SignUpCommand();
    signUpCommand.init({ email, password });

    this.identityClient.signUp(signUpCommand).subscribe((x: any) => {
      console.log(x);
      this.dialogRef.close();
      //this.router.navigate(["Identity/SignIn"]);
    });

    // this.identityClient.login(this.userData).subscribe(
    //   (data) => {
    //     const token = (<any>data).token;
    //     localStorage.setItem("token", token);
    //     location.reload();
    //   },
    //   (err) => {
    //     this.errorMessage = err?.error?.status;
    //     localStorage.setItem("token", "");
    //   }
    // );
  }

  matchPasswords(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
