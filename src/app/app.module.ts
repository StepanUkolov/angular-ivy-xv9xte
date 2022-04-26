import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";

import { RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { NavMenuComponent } from "./components/nav-menu/nav-menu.component";
import { IdentityModule } from "./components/identity/identity.module";
import { AuthorizeInterceptor } from "./providers/interceptors/authorize.interceptor";
import { IdentityService } from "./providers/services/identity.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { AppInitService } from "./app-init.service";
import { APP_INITIALIZER } from "@angular/core";
import { FooterComponent } from './components/footer/footer.component';


import { MaterialModules } from "./material.module";
import { PaymentComponent } from './components/payment/payment.component';
import { QRCodeModule } from "angular2-qrcode";
import { CdTimerModule } from "angular-cd-timer";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { RulesComponent } from './components/rules/rules.component';
import { AdminModule } from "./components/admin/admin.module";
import { BaseComponent } from "./shared/components/base.component";
import { FormBaseComponent } from "./shared/components/form.base.component";
import { MatDialogModule } from "@angular/material/dialog";
import { ConfirmComponent } from "./shared/components/confirm/confirm.component";
import { CountdownModule } from "ngx-countdown";
import { AboutUsComponent } from './components/about-us/about-us.component';

export function initializeApp1(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.Init();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    FooterComponent,
    BaseComponent,
    //SupportChatComponent,
    FooterComponent,
    PaymentComponent,
    RulesComponent,
    ConfirmComponent,
    AboutUsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    HttpClientModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    IdentityModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MaterialModules,
    ReactiveFormsModule,
    
    AdminModule,
    QRCodeModule,
    CdTimerModule,
    ClipboardModule,
    MatDialogModule,
    CountdownModule
  ],
  entryComponents: [
    ConfirmComponent
  ],
  providers: [
    IdentityService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizeInterceptor,
      multi: true,
    },

    AppInitService,
    { provide: APP_INITIALIZER, useFactory: initializeApp1, deps: [AppInitService], multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
