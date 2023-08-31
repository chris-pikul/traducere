/**
 * Provides handlers for handling an entire document, in order to cache and
 * async the processes.
 */

import { Disposable, TextDocument, TextDocumentChangeEvent } from 'vscode';
import { debug, info, trace } from './logging';
import parseDocument from './parser';
import { cacheDocument } from './cache';
import { debounce } from './lib/functions';

export function handleOpenDocument(doc: TextDocument) {
    if (doc.uri.scheme === 'output' || doc.uri.scheme === 'log') {
        return;
    }

    info(`Handling opening of document "${doc.uri}"`);

    const results = parseDocument(doc);
    cacheDocument(doc, results);

    trace('Results for document', results);
}

export function handleSaveDocument(doc: TextDocument) {
    if (doc.uri.scheme === 'output' || doc.uri.scheme === 'log') {
        return;
    }

    debug(`Document "${doc.uri}" was saved, re-parsing`);

    const results = parseDocument(doc);
    cacheDocument(doc, results);

    trace('Results for document', results);
}
