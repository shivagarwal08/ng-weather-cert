import { Component, computed, inject, OnDestroy, OnInit, Signal, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConditionsAndZip, LocationChange } from './../conditions-and-zip.type';
import { CurrentConditionComponent } from './../current-condition/current-condition.component';
import { LocationService } from './../location.service';
import { TabItem } from './../tabs/tab-item';
import { WeatherService } from './../weather.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements OnInit, OnDestroy {
  _unsubscribe$: Subject<void> = new Subject<void>();
  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  // create Tab data whenever currentConditionsByZip value changes
  tabItems: Signal<TabItem[]> = computed(() => {
    const currentConditionAndZips: ConditionsAndZip[] = this.currentConditionsByZip();
    console.log('------computed-->',[...currentConditionAndZips]);
    const tabs: Array<TabItem> = [];
    currentConditionAndZips.forEach((conditionAndZip: ConditionsAndZip) => {
      console.log('-->', conditionAndZip);
      const id: number = conditionAndZip.data.weather[0].id;
      const imgUrl = this.weatherService.getWeatherIcon(id);
      const data: any = {
        location: conditionAndZip,
        imgUrl: imgUrl,
        title: `${conditionAndZip.data.name} (${conditionAndZip.zip})`
      }
      tabs.push(new TabItem(CurrentConditionComponent, data));
    })
    console.log('---------->..>>>>', tabs);
    this.selectedIndex = tabs.length - 1;
    return tabs;
  })

  @ViewChild('weatherCondition') weatherConditionTemplate!: any;
  selectedIndex: number = 0;

  constructor() {
  }

  ngOnInit(): void {

    // on location add/remove update the current condition data
    this.locationService.getLocations()
      .pipe(
        takeUntil(this._unsubscribe$)
      )
      .subscribe((location: LocationChange) => {
        if (location) {
          if (location.type === 'ADD' && location.zipcode) {
            // if action is of type 'ADD' fetch the data
            this.weatherService.addCurrentConditions(location.zipcode);
          } else if (location.type === 'REMOVE' && location.zipcode) {
            // if action is of type 'REMOVE' delete the data
            this.weatherService.removeCurrentConditions(location.zipcode);
          } else if (location.locations && location.locations.length > 0) {
            // initial load where locations are from localStorage
            for (let zipcode of location.locations) {
              this.weatherService.addCurrentConditions(zipcode);
            }
          }
        }
      })
  }

  onTabSelect(index: number) {
    this.selectedIndex = index;
  }
  
  removeLocation(tab: TabItem) {
    const zip = (tab.data as any).location.zip;
    this.locationService.removeLocation(zip);
    this.weatherService.removeCurrentConditions(zip);
  }

  showForecast(tab: TabItem) {
    const zip = (tab.data as any).location.zip;
    this.router.navigate(['/forecast', zip])
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._unsubscribe$.unsubscribe();
  }
}
