import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AboutUsComponent } from "./components/about-us/about-us.component";
import { HomeComponent } from "./components/home/home.component";
import { PaymentComponent } from "./components/payment/payment.component";
import { RulesComponent } from "./components/rules/rules.component";
import { ApplicationRole } from "./core/constants/application-role.constant";
import { AuthorizeGuard } from "./providers/guards/authorize.guard";
import { RoleGuard } from "./providers/guards/role.guard";
//import { SupportChatComponent } from "./components/support-chat/support-chat.component";

export const routes: Routes = [
  {
    path: "Identity",
    loadChildren: () =>
      import("./components/identity/identity-routing.module").then(
        (m) => m.IdentityRoutingModule
      ),
  },
  //{ path: "chat", component: SupportChatComponent },
  { path: "payment/:id", component: PaymentComponent, },
  { path: "rules", component: RulesComponent, },
  { path: "about-us", component: AboutUsComponent, },
  {
    path: 'admin',
    loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule),
    canActivate: [RoleGuard],
    data: {
      roles: [ApplicationRole.Admin]
    }
  },
  { path: "", component: HomeComponent, pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
