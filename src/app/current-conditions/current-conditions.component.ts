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
    const tabs: Array<any> = [];
    currentConditionAndZips.forEach((conditionAndZip: ConditionsAndZip) => {
      console.log('-------->', conditionAndZip.zip);
      const id: number = conditionAndZip.data.weather[0].id;
      const imgUrl = this.weatherService.getWeatherIcon(id);
      const data: any = {
        location: conditionAndZip,
        imgUrl: imgUrl,
        title: `${conditionAndZip.data.name} (${conditionAndZip.zip})`
      }
      tabs.push(data);
    })
    // TODO
    // this.selectedIndex = tabs.length - 1;
    return tabs;
  })

  selectedIndex: number = 0;
  @ViewChild(TabsComponent) tabsComponent!: any;
  @ViewChild('personEdit') editPersonTemplate!: any;

  constructor() {
  }


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

  /*   onTabSelect(index: number) {
      this.selectedIndex = index;
    } */
  tabTrackBy(index: number, item: any) {    
    const title = item ? item.title : null;
    console.log('trackBY', title, item);
    return title;
  }

  onEditPerson(person: any) {
    this.tabsComponent.openTab(
      `Editing ${person.name}`,
      this.editPersonTemplate,
      person,
      true
    );
  }
  onAddPerson() {
    this.tabsComponent.openTab('New Person', this.editPersonTemplate, {}, true);
  }
  onPersonFormSubmit(dataModel: any) {
    // create a new one
    dataModel.id = Math.round(Math.random() * 100);
    // TODO
    // this.people.push(dataModel);
    // close the tab
    this.tabsComponent.closeActiveTab();
  }
  openTab(person: any) {
    this.tabsComponent.openTab(
      `Editing ${person.name}`,
      this.editPersonTemplate,
      person,
      true
    );
  }

  /* removeLocation(tab: TabItem) {
    const zip = (tab.data as any).location.zip;
    this.locationService.removeLocation(zip);
    this.weatherService.removeCurrentConditions(zip);
  } */

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._unsubscribe$.unsubscribe();
  }
}
