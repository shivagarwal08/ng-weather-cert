import { CurrentConditions } from './current-conditions/current-conditions.type';

export interface ConditionsAndZip {
    zip: string;
    data: CurrentConditions;
}
export interface LocationChange {
    locations: Array<string>;
    zipcode?: string;
    type?: 'ADD' | "REMOVE"
}
