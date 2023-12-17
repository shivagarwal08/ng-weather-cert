import { Component, HostBinding, Input, OnChanges, Output, SimpleChanges, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-tab-header',
  templateUrl: './tab-header.component.html',
  styleUrl: './tab-header.component.css'
})
export class TabHeaderComponent implements OnChanges {
  @Input() Header: string = '';
  @Input() uniqueCode: string = '';
  @Input() isActive: boolean = true;
  @HostBinding('class') hostClass: string = '';
  @Output() Selected: EventEmitter<string> = new EventEmitter();
  @Output() Close: EventEmitter<string> = new EventEmitter();
  @HostListener('click') onHostSelected() {
    this.Selected.emit(this.uniqueCode);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isActive'] !== undefined) {
      if (changes['isActive'].currentValue === true) {
        this.hostClass = 'active';
      } else {
        this.hostClass = '';
      }
    }
  }

  closeTab() {
    this.Close.emit(this.uniqueCode);
  }

}
