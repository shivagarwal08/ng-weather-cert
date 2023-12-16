import { CurrentConditions } from './current-conditions/current-conditions.type';
import { Forecast } from './forecasts-list/forecast.type';

export interface CacheResponse {
    currentConditions: CurrentConditions;
    forecast: Forecast;
}
export interface CacheResponseItem extends CacheResponse {
    cachedAtMs: number;
}
export interface CacheResponseData {
    [key: string]: CacheResponseItem
}
