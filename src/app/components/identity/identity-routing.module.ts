import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "../../../app/providers/guards/role.guard";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { ApplicationRole } from "../../core/constants/application-role.constant";
import { AccountComponent } from "./account/account.component";
import { AuthorizeGuard } from "../../../app/providers/guards/authorize.guard";
import { MatDialogRef } from "@angular/material/dialog";

export const routes: Routes = [
  {
    path: "SignIn",
    component: SignInComponent,
  },
  //{
  //  path: "Account",
  //  component: AccountComponent,
  //  canActivate: [AuthorizeGuard, RoleGuard],
  //  data: {
  //    roles: [ApplicationRole.User],
  //  },
  //},
  //{
  //  path: "SignUp",
  //  component: SignUpComponent,
  //},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
  ],
})
export class IdentityRoutingModule {}
