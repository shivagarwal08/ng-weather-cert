import { Injectable } from '@angular/core';

@Injectable()
export class CacheResponseService {
    CACHE_TIMEOUT_MS = 2 * 60 * 1000;
    RESPONSE_CACHE: string = "responseCache";

    getItem(url: string) {
        let responseCache = this.getResponseCache();
        if (!responseCache) {
            console.log('responseCache is not present');
            return null;
        }
        const data = responseCache[url];
        if (!data) {
            console.log('data for the location is not present in cache');
            return null;
        }
        let cachedAtMs = data['cachedAtMs'];
        console.log(cachedAtMs);
        const now = new Date().getTime();
        if (now > (cachedAtMs + this.CACHE_TIMEOUT_MS)) {
            console.log('timed out resetting data to null for this location');
            responseCache[url] = null;
            this.setResponseCache(responseCache);
            return null;
        } else {
            let response = data['response'];
            console.log('response', response);
            return response;
        }
    }

    getResponseCache() {
        let responseCacheString = localStorage.getItem(this.RESPONSE_CACHE);
        if (!responseCacheString) {
            console.log('not presnt');
            return null;
        }
        let responseCache = JSON.parse(responseCacheString);
        console.log(responseCache);
        return responseCache;
    }
    setResponseCache(responseCache: any) {
        localStorage.setItem(this.RESPONSE_CACHE, JSON.stringify(responseCache));
    }
    updateItem(url: string, data: any) {
        let responseCache = this.getResponseCache();
        if (!responseCache) {
            responseCache = {};
        }
        responseCache[url] = {};
        responseCache[url]['response'] = data;
        responseCache[url]['cachedAtMs'] = new Date().getTime();
        this.setResponseCache(responseCache);
    }
}