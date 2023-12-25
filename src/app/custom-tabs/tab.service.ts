import { Injectable } from "@angular/core";
import { TabDataModel } from "./interface";
import { TabComponent } from "./tab/tab.component";

@Injectable()
export class TabService {

    public readonly selection = new TabDataModel<TabComponent>();

    public get selected(): TabComponent | undefined {
        return this.selection.selected[0];
    }

    public select(tab: TabComponent): void {
        if (tab) {
            this.selection.select(tab);
        }
    }

    isSelected(tab: TabComponent) {
        return this.selected === tab;
    }
}
