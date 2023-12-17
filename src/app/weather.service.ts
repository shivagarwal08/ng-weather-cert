import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, Subject, map } from 'rxjs';
import { CacheResponse, CacheResponseItem } from './cache-storage.type';
import { CacheResponseService } from './cache.response.service';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { Forecast } from './forecasts-list/forecast.type';

@Injectable()
export class WeatherService {
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  // private currentConditions = signal<ConditionsAndZip[]>([]);

  currentConditions!: ConditionsAndZip;
  currentConditions$ = new Subject<ConditionsAndZip>();
  constructor(private http: HttpClient, private cacheService: CacheResponseService) { }

  getCurrentConditionsData() {
    return this.currentConditions$.asObservable();
  }

  fetchCurrentConditions(url: string): Observable<CurrentConditions> {
    return this.http.get<CurrentConditions>(url);
  }

  fetchForecast(url: string): Observable<Forecast> {
    return this.http.get<Forecast>(url);
  }

  getCurrentConditions(zipcode: string): void {
    let url = `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`;
    if (this.cacheService.isItemPresent(url)) {
      console.log('data is present in cache storage');
      let data: ConditionsAndZip = this.cacheService.getItem(url) as ConditionsAndZip;
      this.currentConditions$.next(data);
    } else {
      console.log('data is not present in cache storage');
      this.fetchCurrentConditions(url)
        .pipe(
          map((response: CurrentConditions) => {
            const conditionAndZip: ConditionsAndZip = {
              zip: zipcode,
              data: response
            };
            this.cacheService.updateItem(url, conditionAndZip);
            return conditionAndZip;
          })
        ).subscribe((data: ConditionsAndZip) => {
          this.currentConditions$.next(data);
        })
    }
  }

  getForecast(zipcode: string): Observable<Forecast> {
    let url = `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`;
    if (this.cacheService.isItemPresent(url)) {
      console.log('data is present in cache storage');
      let data: Forecast = this.cacheService.getItem(url) as Forecast;
      return of(data);
    } else {
      console.log('data is not present in cache storage');
      return this.fetchForecast(url)
        .pipe(
          map((response: Forecast) => {
            this.cacheService.updateItem(url, response);
            return response;
          })
        );
    }
  }

  removeCurrentConditions(zipcode: string) {
    console.log('removeCurrentConditions zipcode:', zipcode);
  }

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }

}
