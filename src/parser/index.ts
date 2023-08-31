import { Position, TextDocument } from 'vscode';
import type { Block, ParseResults, Parser } from './types';

import CFamily from './c-family';

export * from './types';

/* eslint-disable @typescript-eslint/naming-convention */
const parsers: Record<string, Parser> = {
    'c': CFamily,
    'c++': CFamily,
    'javascript': CFamily,
    'typescript': CFamily,
    'java': CFamily,
    'go': CFamily,
    'rust': CFamily,
};
/* eslint-enable */

/**
 * Takes an incoming TextDocument and parses it for any juicy bits. It's advised
 * that this is ran asynchronously if possible.
 *
 * @param doc TextDocument
 * @returns Array of Block items describing the useful bits
 * @throws If the language is unsupported
 */
export function parseDocument(doc: TextDocument): ParseResults {
    if (doc.languageId in parsers) {
        return parsers[doc.languageId](doc);
    }
    throw new Error(`unsupported language`);
}
export default parseDocument;

/**
 * Returns the block at the given position if one exists
 *
 * @param blocks ParseResults block array
 * @param pos Position to search for
 * @returns Block if it exists, otherwise null
 */
export function getBlock(blocks: ParseResults, pos: Position): Block | null {
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].range.contains(pos)) {
            return blocks[i];
        }
    }
    return null;
}
