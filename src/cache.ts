import { TextDocument } from 'vscode';
import { getContext } from './lib/state';
import { debug, error, info } from './logging';
import type { ParseResults } from './parser';

const CACHE_KEY = 'traducere.cache';

export type CacheEntry = {
    uri: string;
    languageId: string;
    blocks: ParseResults;
};

export type Cache = Map<string, CacheEntry>;

export function getCache(): Cache | undefined {
    return getContext()?.workspaceState?.get<Cache>(CACHE_KEY);
}

export function setCache(cache: Cache): void {
    getContext()
        ?.workspaceState?.update(CACHE_KEY, cache)
        .then(() => debug('cache was updated'));
}

export function hasDocumentCached(uri: string): boolean {
    const cache = getCache();
    if (!cache) {
        info('Nothing is cached yet');
        return false;
    }
    return cache.has(uri);
}

export function cacheDocument(doc: TextDocument, blocks: ParseResults): void {
    let cache = getCache();
    if (!cache || typeof cache.set !== 'function') {
        cache = new Map<string, CacheEntry>() as Cache;
    }

    const entry: CacheEntry = {
        uri: doc.uri.toString(),
        languageId: doc.languageId,
        blocks,
    };

    cache.set(entry.uri, entry);

    setCache(cache);
    info(`Cached document "${entry.uri}"`);
}

export function getCachedDocument(uri: string): CacheEntry | null {
    const cache = getCache();
    if (!cache) {
        return null;
    }

    return cache.get(uri) ?? null;
}
