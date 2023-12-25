import { AfterContentInit, Component, ContentChildren, OnDestroy, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { Subscription } from 'rxjs';
import { TabService } from '../tab.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
  providers: [TabService]
})
export class TabsComponent implements AfterContentInit, OnDestroy {

  // Get all the tab components
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
  private readonly subscription: Subscription[] = [];

  constructor(public tabService: TabService) {
  }

  ngAfterContentInit(): void {
    // after content is added in the view, select the default/previously selected tab
    this.tabsChanged();
    // add the subscription on tabs changes event from all tabs in QueryList
    this.subscription.push(this.tabs.changes.subscribe(this.tabsChanged.bind(this)));
  }

  tabsChanged(): void {
    const selected = this.tabService.selected;
    const isPresent = this.tabs.find((tab: TabComponent) => tab === selected);
    // if previously tab is selected and now that tab is still present(not removed)
    // then keep the same tab as selected, else make the first tab active
    if (!isPresent) {
      if(this.tabs.length === 0) {
        this.tabService.select(undefined);

      }else {
        this.tabService.select(this.tabs.get(0)!);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

}
