import { EventEmitter } from '@angular/core';
import { TabItem } from './tab-item';

export interface TabComponent {
    data: any;
    showForecast: EventEmitter<TabItem>;
}
