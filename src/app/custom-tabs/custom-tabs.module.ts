import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabComponent } from './tab/tab.component';
import { TabsComponent } from './tabs/tabs.component';

@NgModule({
  declarations: [
    TabComponent,
    TabsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [TabComponent, TabsComponent],

})
export class CustomTabsModule { }
