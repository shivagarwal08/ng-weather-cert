import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HeroDetailsComponent } from './hero-details/hero-details.component';
import { HeroComponent } from './hero/hero.component';
import { TabControlComponent } from './tab-control/tab-control.component';
import { TabHeaderComponent } from './tab-header/tab-header.component';

@NgModule({
  declarations: [
    HeroDetailsComponent,
    TabControlComponent,
    TabHeaderComponent,
    HeroComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
  ],
  exports: [
    TabControlComponent
  ]
})
export class CustomTabsModule { }
