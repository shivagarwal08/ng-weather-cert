import { Component, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ITab, ITabComponent, TabAddType } from './../models/tab.types';
import { TabService } from './../tab.service';

@Component({
  selector: 'app-tab-control',
  templateUrl: './tab-control.component.html',
  styleUrl: './tab-control.component.css'
})
export class TabControlComponent implements OnDestroy {
  tabItemSubscription!: Subscription;
  index: number = 0;
  tabs: ITab[] = [];
  @ViewChild('containerRef', { read: ViewContainerRef, static: true }) containerRef!: ViewContainerRef;

  constructor(private tabService: TabService) {

    this.tabItemSubscription = this.tabService.tabItemObservable.subscribe({
      next: (res: TabAddType) => {
        this.addNewTab(res);
      },
      error: (err: any) => {
        console.log('error:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.tabItemSubscription.unsubscribe();
  }

  addNewTab(addType: TabAddType) {
    const code = addType.code;
    var uniqueCode = code;
    this.index++;

    this.containerRef.detach();
    var component = this.containerRef.createComponent(addType.type);
    component.instance.isActive = true;
    component.instance.data = addType.data;

    for (let tab of this.tabs) {
      tab.content.instance.isActive = false;
    }
    this.tabs.unshift({
      uniqueCode: uniqueCode,
      header: code,
      content: component,
      view: this.containerRef.get(0)!
    })
  }

  selectTab(uniqueCode: string) {
    for (let tab of this.tabs) {
      if (tab.uniqueCode === uniqueCode) {
        tab.content.instance.isActive = true;
        this.containerRef.detach();
        this.containerRef.insert(tab.view)

      } else {
        tab.content.instance.isActive = false;
      }
    }
  }

  closeTab(uniqueCode: string) {
    var tabToClose: ITab | null = null;
    var index = -1;

    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].uniqueCode === uniqueCode) {
        tabToClose = this.tabs[i];
        index = i;
      }
    }
    var component = tabToClose ?.content.instance as ITabComponent;
    if (tabToClose !== null) {
      this.removeTab(tabToClose!, index);
    }
  }

  removeTab(tabToRemove: ITab, index: number) {
    const zipcode = tabToRemove.content.instance.data.zip;
    if (tabToRemove.content.instance.isActive) {
      tabToRemove.content.instance.isActive = false;
      this.tabs.splice(index, 1);
      this.containerRef.detach();
      if (this.tabs.length > 0) {
        if (index === this.tabs.length) {
          this.tabs[index - 1].content.instance.isActive = true;
          this.containerRef.insert(this.tabs[index - 1].view);
        } else {
          this.tabs[index].content.instance.isActive = true;
          this.containerRef.insert(this.tabs[index].view);
        }
      }
    } else {
      this.tabs.splice(index, 1);
    }
    this.tabService.tabRemoveObservable.next(zipcode);
  }
}
