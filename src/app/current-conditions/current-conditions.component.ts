import { TabData } from './../tab/tab-data.type';
import { TabsComponent } from './../tabs/tabs.component';
import { Component, computed, inject, OnDestroy, OnInit, Signal, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConditionsAndZip, LocationChange } from './../conditions-and-zip.type';
import { LocationService } from './../location.service';
import { WeatherService } from './../weather.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements OnInit, OnDestroy {
  _unsubscribe$: Subject<void> = new Subject<void>();
  private weatherService = inject(WeatherService);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  // create Tab data whenever currentConditionsByZip value changes
  tabItems: Signal<any[]> = computed(() => {
    const currentConditionAndZips: ConditionsAndZip[] = this.currentConditionsByZip();
    const tabs: Array<TabData> = [];
    currentConditionAndZips.forEach((conditionAndZip: ConditionsAndZip) => {
      console.log('-------->', conditionAndZip.zip);
      const id: number = conditionAndZip.data.weather[0].id;
      const imgUrl = this.weatherService.getWeatherIcon(id);
      const data = {
        location: conditionAndZip,
        imgUrl: imgUrl,
        code: conditionAndZip.zip,
        title: `${conditionAndZip.data.name} (${conditionAndZip.zip})`
      }
      tabs.push(data);
    })
    return tabs;
  })

  @ViewChild(TabsComponent) tabsComponent!: any;

  ngOnInit(): void {
    // on location add/remove update the current condition data
    this.locationService.getLocations()
      .pipe(
        takeUntil(this._unsubscribe$)
      )
      .subscribe((location: LocationChange) => {
        console.log('----------location:', location);
        if (location) {
          if (location.type === 'ADD' && location.zipcode) {
            // if action is of type 'ADD' fetch the data
            console.log('----------ADD:', location.zipcode);
            this.weatherService.addCurrentConditions(location.zipcode);
          } else if (location.type === 'REMOVE' && location.zipcode) {
            // if action is of type 'REMOVE' delete the data
            console.log('----------REMOVE:', location.zipcode);
            this.weatherService.removeCurrentConditions(location.zipcode);
          } else if (location.locations && location.locations.length > 0) {
            console.log('----------elseif:', location);
            // initial load where locations are from localStorage
            for (let zipcode of location.locations) {
              console.log('---------sending:', zipcode);
              this.weatherService.addCurrentConditions(zipcode);
            }
          }
        }
      })
  }

  tabTrackBy(index: number, item: any) {
    const title = item ? item.title : null;
    // console.log('trackBY', title, item);
    return title;
  }
  onRemoveTab(event: TabData) {
    console.log('oRemovetab', event.code);
    this.locationService.removeLocation(event.code);
  }
  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._unsubscribe$.unsubscribe();
  }
}
