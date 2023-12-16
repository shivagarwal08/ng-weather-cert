import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { TabComponent } from './tab-component';
import { TabHostDirective } from './tab-host.directive';
import { TabItem } from './tab-item';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnChanges {
    @Input() tabs: TabItem[] = [];
    @Output() remove = new EventEmitter<TabItem>();
    @Output() tabSelected = new EventEmitter<number>();
    @ViewChild(TabHostDirective, { static: true }) tabHost!: TabHostDirective;
    @Input() selected: number = -1;

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            const selected: SimpleChange = changes['selected'];
            if (selected && (selected.firstChange || (selected.currentValue !== selected.previousValue))) {
                this.selectTab(selected.currentValue);
            }
        }
    }

    tabTrackBy(index: number, item: TabItem) {
        const title = item ? item.data.title : null;
        return title;
    }

    createTabs() {
        if (this.tabs && this.tabs.length > 0) {
            this.selectTab(this.tabs.length - 1);
        }
    }
    onTabSelect(index: number) {
        this.tabSelected.emit(index);
    }
    selectTab(index: number) {
        if (index === -1) {
            return;
        }
        this.selected = index;
        const tabItem = { ...this.tabs[index] };
        const viewContainerRef = this.tabHost.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent<TabComponent>(tabItem.component);
        componentRef.instance.data = tabItem.data;
    }

    removeTab(event: Event, index: number) {
        event.stopPropagation();
        const tabItem = this.tabs[index];
        const isSelected = index === this.selected;
        if (index > -1) {
            this.tabs.splice(index, 1);
            this.remove.emit(tabItem)
        }
        if (isSelected) {
            this.selectTab(0);
        }
    }
}
