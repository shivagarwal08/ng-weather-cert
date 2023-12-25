import { Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { Router } from "@angular/router";
import { Subject, takeUntil } from 'rxjs';
import { ConditionsAndZip } from '../conditions-and-zip.type';
import { LocationService } from "../location.service";
import { WeatherService } from "../weather.service";

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
})
export class CurrentConditionsComponent implements OnInit, OnDestroy {

  public weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();
  _unsubscribe$: Subject<void> = new Subject<void>();

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode])
  }

  ngOnInit(): void {
    // if a new location is added then add current conditions in weather service
    this.locationService.getAddLocation()
      .pipe(
        takeUntil(this._unsubscribe$)
      )
      .subscribe((zipcode: string) => {
        this.weatherService.addCurrentConditions(zipcode);
      });

    // if a location is remove then remove the current conditions in weather service
    this.locationService.getRemoveLocation()
      .pipe(
        takeUntil(this._unsubscribe$)
      )
      .subscribe((zipcode: string) => {
        this.weatherService.removeCurrentConditions(zipcode);
      });

    const locations = this.locationService.getLocations();
    const locationLoaded = this.locationService.getLocationLoaded();
    // update flag as we are adding these locations into WeatherService and we don't want to add again
    this.locationService.setLocationLoaded(true);
    if (!locationLoaded && locations && locations.length > 0) {
      for (let zipcode of locations) {
        this.weatherService.addCurrentConditions(zipcode);
      }
    }
  }
  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._unsubscribe$.unsubscribe();
  }
}
