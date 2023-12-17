import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { WeatherService } from '../weather.service';
import { Forecast } from './forecast.type';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent {

  zipcode!: string;
  forecast!: Forecast;

  constructor(protected weatherService: WeatherService, route: ActivatedRoute) {
    route.params.subscribe((params: any) => {
      this.zipcode = params['zipcode'];
      weatherService.getForecast(this.zipcode!)
        .subscribe((data: (Forecast)) => {
          if (data) {
            this.forecast = data;
          }
        });
    });
  }
}
