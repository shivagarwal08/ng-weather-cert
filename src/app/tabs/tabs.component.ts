import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, SimpleChange } from '@angular/core';
import { TabComponent } from './tab-component';
import { TabHostDirective } from './tab-host.directive';
import { TabItem } from './tab-item';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, OnChanges {
    @Input() tabs: TabItem[] = [];
    @Output() showForecast = new EventEmitter<TabItem>();
    @Output() remove = new EventEmitter<TabItem>();
    @Output() tabchangeselet = new EventEmitter<number>();
    @ViewChild(TabHostDirective, { static: true }) tabHost!: TabHostDirective;
    @Input() selected: number = -1;

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('ngOnChanges:', changes);
        console.log(changes);
        if (changes) {
            const selected: SimpleChange = changes['selected'];
            if (selected && (selected.firstChange || (selected.currentValue !== selected.previousValue))) {
                console.log('------------------SELECT TAB -----------', selected.currentValue);
                this.selectTab(selected.currentValue);
            }
        }
    }
    ngOnInit(): void {
        console.log('ngOnInit:');
    }
    tabTrackBy(index: number, item: TabItem) {
        const title = item ? item.data.title : null;
        return title;
    }

    createTabs() {
        console.log('createTabs: tabs:', this.tabs);
        if (this.tabs && this.tabs.length > 0) {
            this.selectTab(this.tabs.length - 1);
        }
    }
    onTabSelect(index: number) {
        this.tabchangeselet.emit(index);
    }
    selectTab(index: number) {
        console.log('selectTab:', index);
        this.selected = index;
        const tabItem = { ...this.tabs[index] };
        const viewContainerRef = this.tabHost.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent<TabComponent>(tabItem.component);
        // console.log(tabItem.data);
        componentRef.instance.data = tabItem.data;
        // componentRef.instance.showForecast = this.showForecast;
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
