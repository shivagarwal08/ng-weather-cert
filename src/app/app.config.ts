import { InjectionToken } from '@angular/core';

export const TIMEOUT_MS: number = 2 * 60 * 60 * 1000;
export const CACHE_TIMEOUT_MS = new InjectionToken('cacheTimeoutMs');