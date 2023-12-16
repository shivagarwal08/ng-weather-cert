import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
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
  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(private http: HttpClient, private cacheService: CacheResponseService) { }

  getUpdatedSignalValue(prev: ConditionsAndZip[], curr: ConditionsAndZip) {
    let reduced: ConditionsAndZip[] = [];
    let matched = false;
    for (let item of prev) {
      if (item['zip'] === curr['zip']) {
        matched = true;
        item['data'] = curr['data'];
      }
      reduced.push(item);
    }
    if (!matched) {
      reduced.push(curr);
    }
    return reduced;
  }

  addCurrentConditions(zipcode: string): void {
    // if data is present in cache storage
    if (this.cacheService.isItemPresent(zipcode)) {
      // get data from cache storage
      let response: CacheResponseItem = this.cacheService.getItem(zipcode);
      // update the current conditions from cache storage
      return this.currentConditions.update((conditions) => [...conditions, { zip: zipcode, data: response.currentConditions }]);
    } else {
      // get the data for Current Conditions and Forecast for consistency of data
      let observableArr = [];
      let url = `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`;
      // add Current Condition API
      observableArr.push(this.http.get<CurrentConditions>(url));
      // add Forecast API
      observableArr.push(this.fetchForecast(zipcode));
      forkJoin(observableArr).subscribe((dataArr: (CurrentConditions | Forecast)[]) => {
        const data: CurrentConditions = dataArr[0] as CurrentConditions;
        const forecast: Forecast = dataArr[1] as Forecast;
        const response: CacheResponse = {
          currentConditions: data,
          forecast: forecast
        }
        // add the data in the cache storage
        this.cacheService.updateItem(zipcode, response);
        return this.currentConditions.update(conditions => {
          // can use equals for comparision as well
          return this.getUpdatedSignalValue([...conditions], { zip: zipcode, data });
        });
      });
    }
  }

  removeCurrentConditions(zipcode: string) {
    this.currentConditions.update((conditions: ConditionsAndZip[]) => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode)
          conditions.splice(+i, 1);
      }
      return conditions;
    })
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  fetchForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    let url = `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`;
    return this.http.get<Forecast>(url);
  }

  getForecast(zipcode: string): Observable<Forecast | undefined> {
    // Here Forecast data should be present in cache storage as we have already added while saving Current Conditions
    let dataForecast = undefined;
    if (this.cacheService.isItemPresent(zipcode)) {
      const response: CacheResponseItem = this.cacheService.getItem(zipcode);
      dataForecast = response.forecast;
    } else {
      // if not present means data is expired, so we will add both Forecast and CurrentConditions data for consistency
      let observableArr = [];
      let url = `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`;
      // add Current Condition API
      observableArr.push(this.http.get<CurrentConditions>(url));
      // add Forecast API
      observableArr.push(this.fetchForecast(zipcode));
      forkJoin(observableArr).subscribe((dataArr: (CurrentConditions | Forecast)[]) => {
        const data: CurrentConditions = dataArr[0] as CurrentConditions;
        dataForecast = dataArr[1] as Forecast;
        const response: CacheResponse = {
          currentConditions: data,
          forecast: dataForecast
        }
        // add the data in the cache storage
        this.cacheService.updateItem(zipcode, response);
        this.currentConditions.update(conditions => {
          return this.getUpdatedSignalValue([...conditions], { zip: zipcode, data });
        });
      })
    }
    return of(dataForecast);
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
