import { CacheResponseService } from './cache.response.service';
import { TabHostDirective } from './tabs/tab-host.directive';
import { TabsComponent } from './tabs/tabs.component';
import { CurrentConditionComponent } from './current-condition/current-condition.component';
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from "@angular/router";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { routing } from "./app.routing";
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { ForecastsListComponent } from './forecasts-list/forecasts-list.component';
import { LocationService } from "./location.service";
import { MainPageComponent } from './main-page/main-page.component';
import { WeatherService } from "./weather.service";
import { ZipcodeEntryComponent } from './zipcode-entry/zipcode-entry.component';


@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    CurrentConditionsComponent,
    CurrentConditionComponent,
    MainPageComponent,
    TabsComponent,
    TabHostDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [LocationService, WeatherService, CacheResponseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
