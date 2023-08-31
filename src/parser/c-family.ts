import { Position, Range, TextDocument } from 'vscode';
import { Block, BlockType, blockTypes, Parser, ParseResults } from './types';
import { cleanBlockComment } from './utils';

const STRING_CHARS = '"\'`';
const INLINE_START = '//';
const BLOCK_START = '/*';
const BLOCK_END = '*/';

export function cfamilyParser(doc: TextDocument): ParseResults {
    if (doc.lineCount === 0) {
        return [];
    }

    const results: ParseResults = [];

    let block: BlockType | null = null;
    let char: string = '';
    let peek: string = '';
    let closer: string = '';
    let start: Position = new Position(0, 0);

    for (let i = 0; i < doc.lineCount; i++) {
        const line = doc.lineAt(i);
        if (line.isEmptyOrWhitespace) {
            continue;
        }

        let ignoreNext = false;

        // Walk the whole line
        for (
            let j = line.firstNonWhitespaceCharacterIndex;
            j < line.text.length;
            j++
        ) {
            char = line.text.charAt(j);
            peek = j < line.text.length - 1 ? line.text.charAt(j + 1) : '';

            if (char === '\\') {
                ignoreNext = true;
            } else if (ignoreNext) {
                ignoreNext = false;
            } else if (block === null) {
                // NOT in a block, may be the start of one
                if (STRING_CHARS.includes(char)) {
                    // Is a string
                    start = new Position(i, j);
                    block = blockTypes.string;
                    closer = char;
                } else if (char === '/') {
                    if (peek === '/') {
                        // Inline comment, can push immediately
                        results.push({
                            type: blockTypes.comment,
                            range: new Range(
                                new Position(i, j + 2),
                                new Position(i, line.text.length),
                            ),
                            originalText: line.text.substring(j + 2).trim(),
                            cleanText: line.text.substring(j + 2).trim(),
                        });
                        ignoreNext = false;
                        break;
                    } else if (peek === '*') {
                        // Block comment
                        start = new Position(i, j + 2);
                        block = blockTypes.comment;
                        closer = peek;
                    }
                }
            } else if (char === closer) {
                // In a block, and arrived at closer
                if (block === blockTypes.comment) {
                    // Require that the full closer is there
                    if (peek === '/') {
                        const end = new Position(i, j - 1);
                        const range = new Range(start, end);
                        const text = doc.getText(range);

                        results.push({
                            type: blockTypes.comment,
                            range,
                            originalText: text,
                            cleanText: cleanBlockComment(text),
                        });

                        block = null;
                        ignoreNext = false;
                    }
                } else {
                    // It was a string
                    const end = new Position(i, j - 1);
                    const range = new Range(start, end);
                    const text = doc.getText(range);

                    results.push({
                        type: blockTypes.string,
                        range,
                        originalText: text,
                        cleanText: text,
                    });

                    block = null;
                    ignoreNext = false;
                }
            }
        }
    }

    return results;
}
export default cfamilyParser as Parser;
