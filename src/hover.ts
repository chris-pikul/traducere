import {
    type CancellationToken,
    Hover,
    type Position,
    type TextDocument,
} from 'vscode';
import { showError } from './lib/display';
import { useBackendService } from './backend';
import { debug, error } from './logging';
import { getCachedDocument } from './cache';
import { getBlock } from './parser';

function makeHoverMessage(text: string): string {
    return `### Translation \n${text}`;
}

/**
 * Provides the HoverProvider used by vscode when text is hovered
 *
 * @param doc Document that is being hovered
 * @param pos Position on the text
 * @param cancel Cancellation token to register when a user skips past before
 * the promise resolves
 * @returns Promise resolving to a Hover object
 */
export async function hoverProvider(
    doc: TextDocument,
    pos: Position,
    cancel: CancellationToken,
): Promise<Hover | null> {
    try {
        const cached = getCachedDocument(doc.uri.toString());
        if (!cached) {
            debug(`No cached document for "${doc.uri}"`);
            return null;
        }

        // Check if we give up
        if (cancel.isCancellationRequested) {
            return null;
        }

        const block = getBlock(cached.blocks, pos);
        if (!block) {
            // No block, not important
            return null;
        }

        // Check if we give up
        if (cancel.isCancellationRequested) {
            return null;
        }

        const results = await useBackendService(block.cleanText);

        // Check if we give up
        if (cancel.isCancellationRequested) {
            return null;
        }
        return new Hover(makeHoverMessage(results));
    } catch (err) {
        error('Failed to translate for hover provider', err);
        showError(
            `Sorry, we could not translate that at this moment. Check your internet connection, or your Traducere settings, and try again`,
        );
    }

    // It didn't work
    return null;
}
