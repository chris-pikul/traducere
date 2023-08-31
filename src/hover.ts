import {
    type CancellationToken,
    Hover,
    type Position,
    type TextDocument,
} from 'vscode';

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
): Promise<Hover> {
    return new Hover('Hello world');
}
