import {
    AfterContentInit, Component, ComponentFactoryResolver,
    EventEmitter, ContentChildren, QueryList, ViewChild, Output
} from '@angular/core';
import { TabComponent } from './../tab/tab.component';
import { TabHostDirective } from './tab-host.directive';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {
    @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
    @ViewChild(TabHostDirective) tabHostPlaceholder!: TabHostDirective;
    @Output() removeTab = new EventEmitter<TabComponent>();
    constructor(private _componentFactoryResolver: ComponentFactoryResolver) { }

    ngAfterContentInit() {
        // get all active tabs
        if (this.tabs && this.tabs.length > 0) {
            let activeTab = this.tabs.filter((tab) => tab.active);
            // if there is no active tab set, activate the first
            console.log(activeTab);
            if (activeTab.length === 0) {
                this.selectTab(this.tabs.last);
            }
        }
    }
    tabTrackBy(index: number, tab: TabComponent) {
        // console.log('trackby------------------------------>', tab);
        return tab.title;
    }

    openTab(title: string, template: any, data: any) {
        let componentFactory = this._componentFactoryResolver.resolveComponentFactory(TabComponent);
        let viewContainerRef = this.tabHostPlaceholder.viewContainerRef;
        // instantiate the component
        let componentRef = viewContainerRef.createComponent(componentFactory);
        let instance: TabComponent = componentRef.instance as TabComponent;

        console.log('------------------->', title, data);
        // set the props
        instance.title = title;
        instance.template = template;
        instance.dataContext = data;
        // remember the dynamic component for rendering the
        // tab navigation headers
        // set it active
    }
    selectTab(tab: TabComponent) {
        // deactivate all tabs
        console.log('selectTab', tab);
        if (this.tabs && this.tabs.length >= 0) {
            this.tabs.toArray().forEach(tab => tab.active = false);
            // activate the tab the user has clicked on.
            tab.active = true;
        }
    }
    closeTab(tab: TabComponent) {
        if (this.tabs && tab) {
            tab.active = false;
            for (let i = 0; i < this.tabs.length; i++) {
                let item = this.tabs.get(i);
                if (item && item['title'] === tab['title']) {
                    // remove the tab from our array
                    // this.tabs.toArray().splice(i, 1);
                    // destroy our dynamically created component again
                    let viewContainerRef = this.tabHostPlaceholder.viewContainerRef;
                    // let viewContainerRef = this.tabHostPlaceholder;
                    // viewContainerRef.remove(i);
                    // set tab index to 1st one
                    console.log('tab', tab);
                    this.removeTab.emit(tab);
                    this.selectTab(this.tabs.first);
                    break;
                }
            }
        }
    }
    closeActiveTab() {
        const activeTabs = this.tabs.filter(tab => tab.active);
        if (activeTabs.length > 0) {
            // close the 1st active tab (should only be one at a time)
            this.closeTab(activeTabs[0]);
        }
    }

}
