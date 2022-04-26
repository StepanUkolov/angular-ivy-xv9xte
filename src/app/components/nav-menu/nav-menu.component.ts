import { Component } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { IdentityService } from "src/app/providers/services/identity.service";
import { AuthResponse, GeneralSettingClient, GeneralSettingDTO, IdentityClient } from "src/app/web-api-client";
import { AuthorizeGuard } from "../../providers/guards/authorize.guard";
import { SignInComponent } from "../identity/sign-in/sign-in.component";
import { SignUpComponent } from "../identity/sign-up/sign-up.component";

@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.scss"],
})
export class NavMenuComponent {
  info: GeneralSettingDTO
  private _signInDialog: MatDialogRef<SignInComponent>;
  private _signUpDialog: MatDialogRef<SignUpComponent>;
  constructor(
    public identityService: IdentityService,
    private router: Router,
    private dialog: MatDialog,
    private generalSettingsClient: GeneralSettingClient
  ) {
    this.generalSettingsClient.get().subscribe((res: GeneralSettingDTO) => {
      this.info = res;
    })
  }

  signOut() {
    
    if (this.identityService.accessToken) {
    this.identityService
      .signOut(this.identityService.userId)
      .subscribe((x: AuthResponse) => {
        if (x.result.succeeded) {
          this.identityService.clearStorage();
          this.router.navigate(["/"]);
        }
      });
    }
  }

  signIn() {
    this._signInDialog = this.dialog.open(SignInComponent, {

      width: '500px',
      disableClose: true,
      autoFocus: false
    })

  }


  signUp() {
    this._signUpDialog = this.dialog.open(SignUpComponent, {

      width: '600px',
      disableClose: true,
      autoFocus: false
    })

  }
}
