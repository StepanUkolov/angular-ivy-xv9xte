import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { AdminWalletClient, AdminWalletDTO, Order, OrderClient } from '../../web-api-client';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  wallet: string
  amount:string
  order: Order
  timer=1800
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipboard: Clipboard,
    private orderClient: OrderClient,
    private adminWallet: AdminWalletClient) { }

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder() {
    this.route.params.subscribe((data) => {
      //console.log(data);
      if (data["id"]) {
        this.orderClient.getById(data["id"]).subscribe((res: Order) => {
          if (!res) {
            this.router.navigate(["/"])
          }
          //this.timer = (Date.now() - res.creationTime.getTime()) / 1000;
          //console.log(this.timer);
          this.amount = res.value;
          this.adminWallet.getByType(res.walletType).subscribe((res: AdminWalletDTO) => {
            this.wallet = res.wallet
          })
          const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
          //console.log(diffDays(new Date(res.creationTime), new Date()));


          var creationDate = +res.creationTime
          var now = Date.now()
          var diff = now - creationDate
          this.timer = (30*60 - Math.floor(diff/ 1000))

        }, error => {
          this.router.navigate(["/"])
        })
      }
    })
  }
  timerComplete(e:Event) {
    if (e["action"] == "done") {
      this.router.navigate(["/"])
    }
    
  }


  copyWallet() {
    this.clipboard.copy(this.wallet);
  }
  copyAmount() {

    this.clipboard.copy(this.amount.toString());
  }
}
