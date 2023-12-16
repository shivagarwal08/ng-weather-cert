import { TabComponent } from './tab/tab.component';
import { DynamicTabsDirective } from './tabs/dynamic-tabs.directive';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { CACHE_TIMEOUT_MS, TIMEOUT_MS } from './app.config';
import { CacheResponseService } from './cache.response.service';
import { CurrentConditionComponent } from './current-condition/current-condition.component';
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { ForecastsListComponent } from './forecasts-list/forecasts-list.component';
import { LocationService } from "./location.service";
import { MainPageComponent } from './main-page/main-page.component';
import { TabHostDirective } from './tabs/tab-host.directive';
import { TabsComponent } from './tabs/tabs.component';
import { WeatherService } from "./weather.service";
import { ZipcodeEntryComponent } from './zipcode-entry/zipcode-entry.component';


const appRoutes: Routes = [
  {
    path: '', component: MainPageComponent
  },
  {
    path: 'forecast/:zipcode', component: ForecastsListComponent
  },
  {
    path: '', redirectTo: 'main', pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    MainPageComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    CurrentConditionsComponent,
    CurrentConditionComponent,
    TabsComponent,
    TabComponent,
    TabHostDirective,
    DynamicTabsDirective
  ],
  providers: [LocationService, WeatherService, CacheResponseService,
    { provide: CACHE_TIMEOUT_MS, useValue: TIMEOUT_MS }],
  bootstrap: [AppComponent]
})
export class AppModule { }
