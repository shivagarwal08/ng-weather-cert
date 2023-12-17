import { Component, Input } from '@angular/core';
import { ITabComponent } from '../models/tab.types';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements ITabComponent {
  @Input() isActive: boolean = true;
  @Input() data!: any;

  constructor() {
  }
}
