import {
    type CancellationToken,
    Hover,
    type Position,
    type TextDocument,
} from 'vscode';
import { showError } from './lib/display';
import { useBackendService } from './backend';

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
    const text = doc.getText(doc.getWordRangeAtPosition(pos));
    try {
        const results = await useBackendService(text);
        return new Hover(results);
    } catch (err) {
        console.error('Failed to translate for hover provider', err);
        showError(
            `Sorry, we could not translate that at this moment. Check your internet connection, or your Traducere settings, and try again`,
        );
    }

    // It didn't work
    return null;
}
