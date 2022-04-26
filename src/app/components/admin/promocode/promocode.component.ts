import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '../../../shared/components/base.component';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import {  PromocodeClient, PromocodeDTO } from '../../../web-api-client';

@Component({
  selector: 'app-promocode',
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.css']
})
export class PromocodeComponent extends BaseComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['index','code', 'activeFrom', 'bonus','action'];
  promocodes = new MatTableDataSource<PromocodeDTO>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _confirmDialog: MatDialogRef<ConfirmComponent>;
  

  constructor(
    private promocodeClient: PromocodeClient,
    private matDialog: MatDialog
  ) {
    super()
  }

  ngOnInit(): void {
    this.getAllPromocodes()
  }
  ngAfterViewInit() {
    this.promocodes.paginator = this.paginator;
  }

  getAllPromocodes() {
    this._subs.add(
      this.promocodeClient.getAll().subscribe(res => {
        this.promocodes.data=res
      })
    );
  }

  delete(id: string) {
    if (this._confirmDialog) return;
    this._confirmDialog = this.matDialog.open(ConfirmComponent, { width: '500px', disableClose: true, autoFocus: false });

    this._subs.add(
      this._confirmDialog.afterClosed().subscribe(deletionAllowed => {
        this._confirmDialog = undefined;
        if (!deletionAllowed) return;
        this._subs.add(
          this.promocodeClient.delete(id).subscribe(result => {
            if (result.succeeded) {
              this.getAllPromocodes();
            } else {
              //this.notifierService.notify('error', result.errors[0]);//todo add action when result failure
            }
          })
        );
      })
    );
  }

}
