import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-current-condition',
  templateUrl: './current-condition.component.html',
  styleUrls: ['./current-condition.component.css']
})
export class CurrentConditionComponent {
  @Input() data!: any;
}
