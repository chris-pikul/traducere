/**
 * Provides handlers for handling an entire document, in order to cache and
 * async the processes.
 */

import { TextDocument } from 'vscode';
import { debug, info, trace } from './logging';
import parseDocument from './parser';
import { cacheDocument } from './cache';

export function handleDocument(doc: TextDocument) {
    if (doc.uri.scheme === 'output' || doc.uri.scheme === 'log') {
        return;
    }

    info(`Handling opening of document "${doc.uri}"`);

    const results = parseDocument(doc);
    cacheDocument(doc, results);

    trace('Results for document', results);
}
