import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[tabHost]',
})
export class TabHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
