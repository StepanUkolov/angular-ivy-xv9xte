import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PromocodeComponent } from './promocode/promocode.component';
import { BlockWalletComponent } from './block-wallet/block-wallet.component';
import { AdminWalletComponent } from './admin-wallet/admin-wallet.component';
import { MaterialModules } from '../../material.module';
import { PromocodeUpsertComponent } from './promocode/promocode-upsert/promocode-upsert.component';
import { BlockWalletUpsertComponent } from './block-wallet/block-wallet-upsert/block-wallet-upsert.component';
import { UpdateAdminWalletComponent } from './admin-wallet/update-admin-wallet/update-admin-wallet.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SiteSettingsComponent } from './site-settings/site-settings.component';

const routes: Routes = [
  
  {
    path: "blockWallet", component: BlockWalletComponent,
  },
  {
    path: "blockWallet/create", component: BlockWalletUpsertComponent,
  },
  {
    path: "wallets", component: AdminWalletComponent,
  },
  {
    path: 'promo', component: PromocodeComponent,
  },
  {
    path: 'promo/create', component: PromocodeUpsertComponent,
  },
  {
    path: 'password', component: ChangePasswordComponent,
  },
  {
    path: 'settings', component: SiteSettingsComponent,
  },
];

@NgModule({
  
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModules,
    RouterModule.forChild(routes)
  ],
  declarations: [
    PromocodeComponent,
    PromocodeUpsertComponent,
    BlockWalletComponent,
    BlockWalletUpsertComponent,
    UpdateAdminWalletComponent,
    AdminWalletComponent,
    GeneralSettingsComponent,
    ChangePasswordComponent,
    SiteSettingsComponent
  ],
})
export class AdminModule { }
