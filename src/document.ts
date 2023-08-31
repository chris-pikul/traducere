/**
 * Provides handlers for handling an entire document, in order to cache and
 * async the processes.
 */

import { TextDocument } from 'vscode';
import { info } from './logging';

export function handleOpenDocument(doc: TextDocument) {
    if (doc.uri.scheme === 'output' || doc.uri.scheme === 'log') {
        return;
    }

    info(`Handling opening of document "${doc.uri}"`);
}
