import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss']
})
export class TabComponent {
    @Input('title') title!: string;
    @Input('code') code!: string;
    @Input() active = false;
    @Input() template!: any;
    @Input() dataContext!: any;
}
