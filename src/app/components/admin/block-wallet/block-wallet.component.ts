import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '../../../shared/components/base.component';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { BlockedWalletClient, BlockedWalletDTO,  } from '../../../web-api-client';

@Component({
  selector: 'app-block-wallet',
  templateUrl: './block-wallet.component.html',
  styleUrls: ['./block-wallet.component.css']
})
export class BlockWalletComponent extends BaseComponent implements OnInit {
 
  constructor(
    private blockedWalletsClient: BlockedWalletClient,
    private matDialog: MatDialog)
  { super() }
  ngOnInit(): void {
    this.getWallets()
  }

  getWallets() {
    this.blockedWalletsClient.getAll().subscribe((res: BlockedWalletDTO[]) => {
      this.wallets.data = res;
    })
  }
  displayedColumns: string[] = ['index', 'wallet','action'];
  wallets = new MatTableDataSource<BlockedWalletDTO>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _confirmDialog: MatDialogRef<ConfirmComponent>;




  ngAfterViewInit() {
    this.wallets.paginator = this.paginator;
  }

  delete(id: string) {
    if (this._confirmDialog) return;
    this._confirmDialog = this.matDialog.open(ConfirmComponent, { width: '500px', disableClose: true, autoFocus: false });

    this._subs.add(
      this._confirmDialog.afterClosed().subscribe(deletionAllowed => {
        this._confirmDialog = undefined;
        if (!deletionAllowed) return;
        this._subs.add(
          this.blockedWalletsClient.delete(id).subscribe(result => {
            if (result.succeeded) {
              this.getWallets();
            } else {
              //this.notifierService.notify('error', result.errors[0]);//todo add action when result failure
            }
          })
        );
      })
    );
  }

}
