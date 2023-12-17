import { ComponentRef, ViewRef, Type } from '@angular/core';

export interface ITab {
    header: string;
    uniqueCode: string;
    content: ComponentRef<any>;
    view: ViewRef;
}

export interface ITabComponent {
    isActive: boolean;
}

export interface TabAddType {
    type: Type<any>;
    code: string;
    data: any;
}
