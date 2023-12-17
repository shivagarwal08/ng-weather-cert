import { ConditionsAndZip } from './conditions-and-zip.type';
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
export interface CacheItem {
    cachedAtMs: number;
}
export interface CacheConditionsAndZip extends CacheItem {
    data: ConditionsAndZip;
}
export interface CacheForecast extends CacheItem {
    data: Forecast;
}