import { Component } from '@angular/core';
import { LocationService } from "../location.service";

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  constructor(private service: LocationService) { }

  addZipLocation(zipcode: string) {
    console.log('addZipLocation');
    this.service.addLocation(zipcode);
  }

}
