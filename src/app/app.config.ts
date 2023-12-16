import { InjectionToken } from '@angular/core';

export const TIMEOUT_MS: number = 1 * 30 * 1000;
export const CACHE_TIMEOUT_MS = new InjectionToken('cacheTimeoutMs');