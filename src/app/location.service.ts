import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, zip } from 'rxjs';

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {
  // A flag to hold the flag if the data is already added into Weather Service for the zipcodes present in localStoragess
  locationLoaded: boolean = false;
  locations: string[] = [];
  addLocation$ = new Subject<string>();
  removeLocation$ = new Subject<string>();

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
    } else {
      this.locations = [];
    }
  }

  getLocations(): string[] {
    return this.locations;
  }
  getLocationLoaded(): boolean {
    return this.locationLoaded;
  }
  setLocationLoaded(flag: boolean) {
    this.locationLoaded = flag;
  }
  getAddLocation() {
    return this.addLocation$.asObservable();
  }
  getRemoveLocation() {
    return this.removeLocation$.asObservable();
  }
  addLocation(zipcode: string) {
    const present = this.locations.find((item: string) => item === zipcode);
    if (present) {
      window.alert('Location Already Present!');
    } else if (zipcode && zipcode != '') {
      this.locations.push(zipcode);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.addLocation$.next(zipcode);
    } else {
      window.alert('Plese enter a zipcode');
    }
  }

  removeLocation(zipcode: string) {
    console.log('remove location for zip', zipcode);
    let index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.removeLocation$.next(zipcode);
    }
  }
}
