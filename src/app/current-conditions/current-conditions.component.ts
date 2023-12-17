import { Component, inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConditionsAndZip, LocationChange } from './../conditions-and-zip.type';
import { CurrentConditionComponent } from './../current-condition/current-condition.component';
import { TabAddType } from './../custom-tabs/models/tab.types';
import { TabService } from './../custom-tabs/tab.service';
import { LocationService } from './../location.service';
import { WeatherService } from './../weather.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements OnInit {
  private weatherService = inject(WeatherService);
  protected locationService = inject(LocationService);
  private tabService = inject(TabService);

  _unsubscribe$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.weatherService.getCurrentConditionsData()
      .pipe(
        takeUntil(this._unsubscribe$)
      )
      .subscribe((conditionAndZip: ConditionsAndZip) => {
        console.log('Creating tab for data:', conditionAndZip);
        let addData: TabAddType = {
          code: `${conditionAndZip.data.name} (${conditionAndZip.zip})`,
          type: CurrentConditionComponent,
          data: {
            ...conditionAndZip,
            imgUrl: this.weatherService.getWeatherIcon(conditionAndZip.data.weather[0].id)
          }
        }
        this.tabService.tabItemObservable.next(addData);
      });

    this.locationService.getLocations()
      .pipe(
        takeUntil(this._unsubscribe$)
      )
      .subscribe((location: LocationChange) => {
        console.log('locations:', location);
        if (location) {
          if (location.type === 'ADD' && location.zipcode) {
            this.weatherService.getCurrentConditions(location.zipcode);
          } else if (location.type === 'REMOVE' && location.zipcode) {
            this.weatherService.removeCurrentConditions(location.zipcode);
          } else if (location.locations && location.locations.length > 0) {
            for (let zipcode of location.locations) {
              this.weatherService.getCurrentConditions(zipcode);
            }
          }
        }
      })

    this.tabService.tabRemoveObservable
      .pipe(
        takeUntil(this._unsubscribe$)
      )
      .subscribe({
        next: (zipcode: string) => {
          this.locationService.removeLocation(zipcode);
        },
        error: (err: any) => {
          console.log('error:', err);
        }
      });
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._unsubscribe$.unsubscribe();
  }
}
