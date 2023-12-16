import { Component } from '@angular/core';
import { LocationService } from "../location.service";

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  constructor(private service: LocationService) { }

  addLocation(zipcode: string) {
    console.log('addLocation', zipcode);
    this.service.addLocation(zipcode);
  }

}
