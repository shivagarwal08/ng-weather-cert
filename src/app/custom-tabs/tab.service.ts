import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TabAddType } from './models/tab.types';

@Injectable({
  providedIn: 'root'
})
export class TabService {

  tabItemObservable: Subject<TabAddType> = new Subject<TabAddType>();
  tabRemoveObservable: Subject<string> = new Subject<string>();

  constructor() { }

  // addNewTab(code: string) {
  //   this.tabItemObservable.next(code);
  // }
}
