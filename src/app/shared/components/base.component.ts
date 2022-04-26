import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-base',
  template:''
})
export class BaseComponent implements OnDestroy {

  protected _subs: Subscription = new Subscription();
  constructor() { }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }

}
