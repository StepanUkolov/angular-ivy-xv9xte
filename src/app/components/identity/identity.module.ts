import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatNativeDateModule } from "@angular/material/core";
import { BrowserModule } from "@angular/platform-browser";
import { SignInComponent } from "./sign-in/sign-in.component";
import { MaterialModules } from "src/app/material.module";
import { IdentityService } from "src/app/providers/services/identity.service";
import { AccountComponent } from "./account/account.component";

@NgModule({
  declarations: [SignUpComponent, SignInComponent, AccountComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialModules,
    ReactiveFormsModule,
  ],
})
export class IdentityModule {}
