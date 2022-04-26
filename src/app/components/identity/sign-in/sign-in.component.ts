import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import {Router} from "@angular/router";
import {IdentityService} from "../../../../app/providers/services/identity.service";
import {AuthResponse} from "../../../web-api-client";
import {
  IdentityClient,
  ISignUpCommand,
  SignInCommand,
  SignUpCommand,
} from "../../../web-api-client";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
})
export class SignInComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private identityClient: IdentityClient,
    private identityService: IdentityService,
    private router: Router,
    private dialogRef: MatDialogRef<SignInComponent>,
  ) {
  }

  ngOnInit(): void {
    /*if (this.identityService.isAccessTokenValid())
      this.identityService.navigateToAccountPage();*/

    this.form = this.formBuilder.group({
      email: [
        "",
        {
          validaors: [
            Validators.required,
            Validators.email,
            Validators.minLength(2),
            Validators.maxLength(320),
          ],
          asyncValidators: [],
        },
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_-]{8,30}$/)
        ],
      ],
      //rememberMe: ["", []],
    });
  }

  submit() {
    const email = this.form.get("email").value;
    const password = this.form.get("password").value;
    //const rememberMe = this.form.get("rememberMe").value;

    this.identityService.signIn({email, password}).subscribe(
      (response: any) => {
        this.identityService.setAccessToken(response.accessToken)
        //this.dialogRef.close();
        //this.identityService.navigateToAccountPage();
        this.router.navigate(["/"])
      },
      (error) => {
        console.log(error);
      }
    )

  }
}
