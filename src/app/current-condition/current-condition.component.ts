import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TabItem } from '../tabs/tab-item';

@Component({
  selector: 'app-current-condition',
  templateUrl: './current-condition.component.html',
  styleUrls: ['./current-condition.component.css']
})
export class CurrentConditionComponent {
  @Input() data!: any;
  @Output() showForecast = new EventEmitter<TabItem>();
}
