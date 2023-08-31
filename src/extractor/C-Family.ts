import { Position, TextDocument } from 'vscode';
import { removeStrings } from './utils';
import { getContext } from '../lib/state';

export default function cFamilyExtractor(
    doc: TextDocument,
    startPos: Position,
): string | null {
    const line = doc.lineAt(startPos);

    // There is text in here, check if inline comment
    if (!line.isEmptyOrWhitespace && line.text.includes('//')) {
        const cleanText = removeStrings(line.text);
        const possibleComment = cleanText.lastIndexOf('//');
        if (possibleComment >= 0 && possibleComment <= startPos.character) {
            // This is probably a comment, take the rest
            return line.text.substring(possibleComment + 2);
        }
    }

    return null;
}
