import { TextDocument } from 'vscode';
import { getContext } from './lib/state';
import { info } from './logging';

const CACHE_KEY = 'traducere.cache';

export type CacheEntry = {
    uri: string;
    languageId: string;
    data: unknown;
};

export type Cache = Map<string, CacheEntry>;

export function getCache(): Cache | undefined {
    return getContext()?.workspaceState.get(CACHE_KEY);
}

export function setCache(cache: Cache): void {
    getContext()
        ?.workspaceState.update(CACHE_KEY, cache)
        .then(() => {});
}

export function hasDocumentCached(uri: string): boolean {
    const cache = getCache();
    if (!cache) {
        info('Nothing is cached yet');
        return false;
    }
    return cache.has(uri);
}

export function cacheDocument(doc: TextDocument): void {
    const cache = getCache() ?? (new Map() as Cache);

    const entry: CacheEntry = {
        uri: doc.uri.toString(),
        languageId: doc.languageId,
        data: null,
    };
    cache.set(entry.uri, entry);

    setCache(cache);
    info(`Cached document "${entry.uri}"`);
}
