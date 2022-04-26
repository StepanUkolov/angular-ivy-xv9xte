import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '../../../shared/components/base.component';
import { AdminWalletClient, AdminWalletDTO } from '../../../web-api-client';
import { UpdateAdminWalletComponent } from './update-admin-wallet/update-admin-wallet.component';

@Component({
  selector: 'app-admin-wallet',
  templateUrl: './admin-wallet.component.html',
  styleUrls: ['./admin-wallet.component.css']
})
export class AdminWalletComponent extends BaseComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['index', 'walletType', 'wallet',  'action'];
  adminWallets = new MatTableDataSource<AdminWalletDTO>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _updateDialog: MatDialogRef<UpdateAdminWalletComponent>;


  constructor(
    private adminWalletClient: AdminWalletClient,
    private matDialog: MatDialog
  ) {
    super()
  }

  ngOnInit(): void {
    this.getAllAdminWallets()
  }
  ngAfterViewInit() {
    this.adminWallets.paginator = this.paginator;
  }

  getAllAdminWallets() {
    this._subs.add(
      this.adminWalletClient.getAll().subscribe(res => {
        this.adminWallets.data = res
      })
    );
  }
  upd(id: string) {
    this._updateDialog = this.matDialog.open(UpdateAdminWalletComponent, {
      data: { id },
      width: '600px',
      autoFocus: false
    });
    this._updateDialog.afterClosed().subscribe((needToUpdate: boolean) => {
      if (needToUpdate) this.getAllAdminWallets();
      this._updateDialog = undefined;
    })
  }

}
