import { HeroDetailsComponent } from './../custom-tabs/hero-details/hero-details.component';
import { TabAddType } from './../custom-tabs/models/tab.types';
import { Type } from '@angular/core';
import { HeroComponent } from './../custom-tabs/hero/hero.component';
import { TabService } from './../custom-tabs/tab.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs-demo',
  templateUrl: './tabs-demo.component.html',
  styleUrl: './tabs-demo.component.css'
})
export class TabsDemoComponent {
  count: number = 10001;

  constructor(private tabService: TabService) {
  }

  insertComponent(component: string) {
    let code = this.count.toString();
    this.count++;
    let componentType: Type<any> = HeroComponent;
    let data: any = {};
    if (component === 'HeroComponent') {
      componentType = HeroComponent;
      data.heroes = [
        { name: 'Shiv', address: 'India' },
        { name: 'Mark', address: 'USA' },
      ]
    }
    if (component === 'HeroDetailsComponent') {
      componentType = HeroDetailsComponent;
      data = { name: 'Mark', address: 'USA' };
    }
    let addData: TabAddType = {
      code: code,
      type: componentType,
      data: data
    }
    this.tabService.tabItemObservable.next(addData);
  }
}
