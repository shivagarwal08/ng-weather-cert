import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TabService } from '../tab.service';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css'
})
export class TabComponent {
  
  @ViewChild('tabHeaderTemplate', { static: true }) header!: TemplateRef<unknown>;
  @ViewChild('tabContentTemplate', { static: true }) content!: TemplateRef<unknown>;

  constructor(private tabService: TabService) {

  }

  public get isSelected(): boolean {
    return this.tabService.isSelected(this);
  }

}
