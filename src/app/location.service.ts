import { Type } from '@angular/core';
import { LocationChange } from './conditions-and-zip.type';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {

  locations: string[] = [];
  locations$ = new BehaviorSubject<LocationChange>({
    locations: []
  });

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
    }
    this.locations$.next({ locations: this.locations });
  }

  getLocations() {
    return this.locations$.asObservable();
  }

  addLocation(zipcode: string) {
    const present = this.locations.find((item: string) => item === zipcode);
    if (present) {
      console.log('Already Present');
    } else {
      this.locations.push(zipcode);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.locations$.next({
        locations: this.locations,
        zipcode: zipcode,
        type: 'ADD'
      });
    }
  }


  removeLocation(zipcode: string) {
    console.log('locationservice.removeLocation zipcode:', zipcode);
    let index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.locations$.next({
        locations: this.locations,
        zipcode: zipcode,
        type: 'REMOVE'
      });
    } else {
      console.log('remove tab not present');
    }
  }
}
