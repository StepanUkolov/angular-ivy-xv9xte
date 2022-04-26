import { HttpClient } from '@angular/common/http';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, finalize, max, tap } from 'rxjs/operators';
import { Msg } from '../../core/constants/ValidationMsg';
//
import { AdminWalletClient, AdminWalletDTO, BlockedWalletClient, GeneralSettingClient, GeneralSettingDTO, Order, OrderClient, OrderCreate, PromocodeClient, PromocodeDTO } from '../../web-api-client';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  allowPromo = false;
  error = Msg;
  url = "https://min-api.cryptocompare.com/data/price?fsym="
  walletType = "card"

  summ: number;
  usedPromo = "";

  tax: number
  minSumm: number
  maxSumm: number
  giveAmount: number

  giveType = "BTC"
  receiveType = "USD"


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private promoClient: PromocodeClient,
    private adminWallet: AdminWalletClient,
    private blockedWallet: BlockedWalletClient,
    private siteSettings: GeneralSettingClient,
    private orderClient: OrderClient,
    ) { }
  ngOnInit() {
    this.getSettings();
    this.initialForm();
    this.inputGive();
    //this.inputReceive();
  }

  getSettings() {
    this.siteSettings.get().subscribe((res: GeneralSettingDTO) => {
      this.tax = res.exchangePercentage;
      this.minSumm = res.minValue;
      this.maxSumm = res.maxValue;
    })
  }
  getCryptoCourse() {
    return this.http
      .get(this.url + `${this.giveType}&tsyms=${this.receiveType},USD`)
      .pipe(
        tap((response: any) => {
          this.giveAmount = +this.form.get("give").value * response["USD"]

          if (this.allowPromo) {
            this.http
              .get(this.url + `USD&tsyms=${this.receiveType}`)
              .pipe(
                tap(responsePast => {
                  this.promoClient.getByCode(this.usedPromo).subscribe((r: PromocodeDTO) => {
                    this.form.get("receive").setValue(
                      (+this.form.get("give").value * response[this.receiveType] -
                        ((+this.form.get("give").value * response[this.receiveType]) * this.tax) / 100)
                      +
                      (r.bonus * responsePast[this.receiveType])

                    )
                  })

                })
              ).subscribe()


          }
          else {

            this.form.get("receive").setValue(
              +this.form.get("give").value * response[this.receiveType] -
              ((+this.form.get("give").value * response[this.receiveType]) * this.tax) / 100)
          }
        })
      );
  }

  inputGive() {
    this.form.get("give").valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(res => {
        this.getCryptoCourse().subscribe()
      });

  }

  receive() {
    return this.http
      .get(this.url + `${this.receiveType}&tsyms=${this.giveType}`)
      .pipe(
        tap(response => {
          this.form.get("give").setValue(
            (+this.form.get("receive").value * response[this.giveType])

            + ((+this.form.get("receive").value * response[this.giveType]) * this.tax) / 100)

        })
      );
  }

  inputReceive() {

    this.receive().subscribe()

  }


  selectGive(type: string, currecncy: string) {
    this.form.get("give").setErrors(null)
    this.form.get("giveType").setValue(type)
    this.giveType = currecncy
    this.getCryptoCourse().subscribe()
  }

  selectReceive(type: string, currecncy: string) {
    this.walletType = type;
    this.form.get("receiveType").setValue(type)
    this.receiveType = currecncy
    this.getCryptoCourse().subscribe()
  }

  promo() {
    if (this.form.get("promo").value) {
      this.promoClient.getByCode(this.form.get("promo").value)
        .subscribe((res: PromocodeDTO) => {
          if (res != null) {
            this.http
              .get(this.url + `${this.giveType}&tsyms=USD`)
              .pipe(
                tap((response: any) => {
                  if ((+this.form.get("give").value * response["USD"]) < res.activeFrom) {
                    this.summ = res.activeFrom
                    this.form.get("promo").setErrors({ promo: "promo" })
                    this.allowPromo = false
                  }
                  else {
                    if (this.usedPromo != this.form.get("promo").value) {

                      this.http
                        .get(this.url + `USD&tsyms=${this.receiveType}`)
                        .pipe(
                          tap((r: any) => {

                            this.form.get("receive").setValue(+this.form.get("receive").value + (res.bonus * r[this.receiveType]))
                            this.allowPromo = true;
                            this.form.get("promo").setErrors(null)
                            this.form.get("promo").disable()
                            this.usedPromo = this.form.get("promo").value

                          })).subscribe()

                    }
                  }

                })).subscribe()

          }
          else {
            this.allowPromo = false
            this.form.get("promo").setErrors({ wrongPromo: "wrongPromo" })
          }
        })


    }
  }


  initialForm() {
    this.form = this.formBuilder.group({
      give: ["", [Validators.required,
      Validators.pattern(/^(?!(?:^[-+]?[0.]+(?:[Ee]|$)))(?!(?:^-))(?:(?:[+-]?)(?=[0123456789.])(?:(?:(?:[0123456789]+)(?:(?:[.])(?:[0123456789]*))?|(?:(?:[.])(?:[0123456789]+))))(?:(?:[Ee])(?:(?:[+-]?)(?:[0123456789]+))|))$/)]],
      giveType: ["btc", []],
      receive: ["", [Validators.required,
      Validators.pattern(/^(?!(?:^[-+]?[0.]+(?:[Ee]|$)))(?!(?:^-))(?:(?:[+-]?)(?=[0123456789.])(?:(?:(?:[0123456789]+)(?:(?:[.])(?:[0123456789]*))?|(?:(?:[.])(?:[0123456789]+))))(?:(?:[Ee])(?:(?:[+-]?)(?:[0123456789]+))|))$/)]],
      receiveType: ["card", []],
      promo: ["", []],
      email: ["", [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      wallet: ["", [Validators.required]],
      aggree: ["", [Validators.required]],
    })
  }

  submit() {
    this.form.markAllAsTouched()
    this.checkWallet();
    this.checkAmount();
    if (this.form.invalid) return;
   
    this.markAll();
    var wallet = this.form.get("wallet").value
    if (wallet) {
      this.blockedWallet.getByWallet(wallet).subscribe((res: boolean) => {
        if (res) {
          this.form.get("wallet").setErrors({ blockedWallet: "blockedWallet" });
        }
        else {
          this.form.get("wallet").setErrors(null)
        }

        this.markAll();
        if (this.form.valid) {
          this.adminWallet.getByType(this.form.get("giveType").value).subscribe((res: AdminWalletDTO) => {
           // this.http.get("http://api.ipify.org/?format=json").subscribe((res: any) => {
              var order = new OrderCreate();
            order.ip = "test" //res?.ip;
              order.country ="test" //res?.country
            order.email = this.form.get("email").value
            order.value = this.form.get("give").value
              order.promo = this.usedPromo
              order.wallet = this.form.get("wallet").value
            order.walletType = this.form.get("giveType").value

            order.creationTime = (Date.now()).toString()
              this.orderClient.get().subscribe(res => {
                console.log(res);
              })

              this.orderClient.createOrder(order).subscribe((result: string) => {
                console.log(result);
                this.router.navigate(["payment", result]);
                //this.router.navigate(["payment", this.form.get("give").value, res.wallet])
              })
            });
            
            
         // })
        }
      })
    }




  }

    

  markAll() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
  }

  checkAmount() {
    this.form.get("give").setErrors(null)

    if (this.giveAmount < this.minSumm) {
      this.form.get("give").setErrors({ min: "min" })
    }
    if (this.giveAmount > this.maxSumm) {
      this.form.get("give").setErrors({ max: "max" })
    }
  }


  checkWallet() {
    this.form.get("wallet").setErrors(null)
    var wallet = this.form.get("wallet").value;
/*
    var WAValidator = require('@swyftx/api-crypto-address-validator');

    var valid = WAValidator?.validate(wallet, this.receiveType);
    if (!valid) {
      this.form.get("wallet").setErrors({ wrongWallet: "wrongWallet" });
      return;
    }*/

    const cardTest = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
    //const qiwiTest = /^(91|994|82|372|375|374|44|998|972|66|90|81|1|507|7|77|380|371|370|996|9955|992|373|84)[0-9]{6,14}$/;
    const btcTest = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/
    const ethTest = /^0x[a-fA-F0-9]{40}$/
    const xmrTest = /4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}$/
    const dogecoinTest = /D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}/
    const xrpTest = /r[0-9a-zA-Z]{24,34}/
    //const yoomoneyTest = /^41001[0-9]{7,10}$/
    //const payeerTest = /^P[0-9]{7,}$/
    switch (this.walletType) {     
      case "xrp":
        if (!xrpTest.test(wallet)) {
          this.form.get("wallet").setErrors({ wrongWallet: "wrongWallet" });
          return;
        }
        break;
      case "card":
        if (!cardTest.test(wallet)) {
          this.form.get("wallet").setErrors({ wrongWallet: "wrongWallet" });
          return;
        }
        break;
      case "btc":
        if (!btcTest.test(wallet)) {
          this.form.get("wallet").setErrors({ wrongWallet: "wrongWallet" });
          return;
        }
        break;
      case "eth":
        if (!ethTest.test(wallet)) {
          this.form.get("wallet").setErrors({ wrongWallet: "wrongWallet" });
          return;
        }
        break;
      case "doge":
        if (!dogecoinTest.test(wallet)) {
          this.form.get("wallet").setErrors({ wrongWallet: "wrongWallet" });
          return;
        }
        break;
      case "xmr":
        if (!xmrTest.test(wallet)) {
          this.form.get("wallet").setErrors({ wrongWallet: "wrongWallet" });
          return;
        }
        break;
    }
  }


}
