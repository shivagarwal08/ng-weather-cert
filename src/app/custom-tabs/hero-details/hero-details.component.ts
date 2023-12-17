import { Component, Input } from '@angular/core';
import { ITabComponent } from '../models/tab.types';

@Component({
  selector: 'app-hero-details',
  templateUrl: './hero-details.component.html',
  styleUrl: './hero-details.component.css'
})
export class HeroDetailsComponent implements ITabComponent {
  @Input() isActive: boolean = true;
  @Input() data!: any;
}
