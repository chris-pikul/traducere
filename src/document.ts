/**
 * Provides handlers for handling an entire document, in order to cache and
 * async the processes.
 */

import { TextDocument } from 'vscode';

export function handleOpenDocument(doc: TextDocument) {
    console.log(`Handling opening of document "${doc.uri}`);
}
