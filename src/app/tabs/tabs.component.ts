import { AfterContentInit, Component, ComponentFactoryResolver, ContentChildren, QueryList, ViewChild } from '@angular/core';
import { TabComponent } from './../tab/tab.component';
import { DynamicTabsDirective } from './dynamic-tabs.directive';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {
    dynamicTabs: TabComponent[] = [];
    @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
    @ViewChild(DynamicTabsDirective) dynamicTabPlaceholder!: DynamicTabsDirective;

    constructor(private _componentFactoryResolver: ComponentFactoryResolver) { }

    ngAfterContentInit() {
        // get all active tabs
        let activeTab = this.tabs.filter((tab) => tab.active);
        // if there is no active tab set, activate the first
        if (activeTab.length === 0) {
            this.selectTab(this.tabs.first);
        }
    }
    tabTrackBy(index: number, tab: TabComponent) {
        console.log('trackby------------------------------>', tab);
        return tab.title;
    }

    openTab(title: string, template: any, data: any, isCloseable = true) {
        let componentFactory = this._componentFactoryResolver.resolveComponentFactory(TabComponent);
        let viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
        // instantiate the component
        let componentRef = viewContainerRef.createComponent(componentFactory);
        let instance: TabComponent = componentRef.instance as TabComponent;

        console.log('------------------->', title, data,isCloseable);
        // set the props
        instance.title = title;
        instance.template = template;
        instance.dataContext = data;
        instance.isCloseable = isCloseable;
        // remember the dynamic component for rendering the
        // tab navigation headers
        this.dynamicTabs.push(componentRef.instance as TabComponent);

        // set it active
        this.selectTab(this.dynamicTabs[this.dynamicTabs.length - 1]);
    }
    selectTab(tab: TabComponent) {
        // deactivate all tabs
        this.tabs.toArray().forEach(tab => tab.active = false);
        this.dynamicTabs.forEach(tab => (tab.active = false));
        // activate the tab the user has clicked on.
        tab.active = true;
    }
    closeTab(tab: any) {
        for (let i = 0; i < this.dynamicTabs.length; i++) {
            if (this.dynamicTabs[i] === tab) {
                // remove the tab from our array
                this.dynamicTabs.splice(i, 1);

                // destroy our dynamically created component again
                let viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
                // let viewContainerRef = this.dynamicTabPlaceholder;
                viewContainerRef.remove(i);

                // set tab index to 1st one
                this.selectTab(this.tabs.first);
                break;
            }
        }
    }
    closeActiveTab() {
        const activeTabs = this.dynamicTabs.filter(tab => tab.active);
        if (activeTabs.length > 0) {
            // close the 1st active tab (should only be one at a time)
            this.closeTab(activeTabs[0]);
        }
    }

}
