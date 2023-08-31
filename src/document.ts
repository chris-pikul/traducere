/**
 * Provides handlers for handling an entire document, in order to cache and
 * async the processes.
 */

import { TextDocument } from 'vscode';
import { info } from './logging';

export function handleOpenDocument(doc: TextDocument) {
    info(`Handling opening of document "${doc.uri}`);
}
