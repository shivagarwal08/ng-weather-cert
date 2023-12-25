import { Inject, Injectable } from '@angular/core';
import { CACHE_TIMEOUT_MS } from './app.config';
import { CacheConditionsAndZip, CacheForecast, CacheResponseData, CacheResponseItem } from './cache-storage.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';

@Injectable()
export class CacheResponseService {
    RESPONSE_CACHE: string = "responseCache";
    cacheTimeoutMs: number = 0;

    constructor(@Inject(CACHE_TIMEOUT_MS) cacheTimeoutMs: number) {
        this.cacheTimeoutMs = cacheTimeoutMs;
    }
    isItemPresent(url: string): boolean {
        let responseCache = this.getResponseCache();
        // if cache not available in storage
        if (!responseCache) return false;
        const data: CacheResponseItem = responseCache[url];
        // data for url is not present
        if (!data) return false;
        // if data is expired
        if (this.checkAndClearExpiredFor(url)) return false;
        // if data is present return respone as true
        return true;
    }
    checkAndClearExpiredFor(url: string) {
        let responseCache = this.getResponseCache();
        const now = new Date().getTime();
        let data = responseCache[url];
        let isExpired = false;
        if (data) {
            let cachedAtMs = data['cachedAtMs'];
            if (now > (cachedAtMs + this.cacheTimeoutMs)) {
                isExpired = true;
            }
        }
        if (isExpired) {
            console.log('cached data expired for: ', url);
            delete responseCache[url];
            this.setResponseCache(responseCache);
        }
        return isExpired;
    }
    getItem(url: string): ConditionsAndZip | Forecast {
        let responseCache = this.getResponseCache();
        let responseWithTime: CacheConditionsAndZip | CacheForecast = responseCache[url];
        let response: ConditionsAndZip | Forecast = responseWithTime.data;
        return response;
    }
    clearExpiredData() {
        let responseCache = this.getResponseCache();
        const now = new Date().getTime();
        const zipcodes = Object.keys(responseCache);
        for (let zipcode of zipcodes) {
            let data = responseCache[zipcode];
            if (data) {
                let cachedAtMs = data['cachedAtMs'];
                if (now > (cachedAtMs + this.cacheTimeoutMs)) {
                    delete responseCache[zipcode];
                }
            }
        }
        this.setResponseCache(responseCache);
    }

    getResponseCache() {
        let responseCacheString = localStorage.getItem(this.RESPONSE_CACHE);
        // response cache not present
        if (!responseCacheString) return null;
        let responseCache = JSON.parse(responseCacheString);
        return responseCache;
    }
    setResponseCache(responseCache: CacheResponseData) {
        localStorage.setItem(this.RESPONSE_CACHE, JSON.stringify(responseCache));
    }
    updateItem(url: string, data: (ConditionsAndZip | Forecast)) {
        let responseCache = this.getResponseCache();
        if (!responseCache) {
            responseCache = {};
        }
        // while adding the data, add time also to maintain when the data was added
        responseCache[url] = {
            data: data,
            cachedAtMs: new Date().getTime()
        };
        this.setResponseCache(responseCache);
    }
}
