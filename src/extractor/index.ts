import { Position, TextDocument } from 'vscode';
import { CommentExtractor } from './types';
import cFamilyExtractor from './C-Family';

const extractors: Record<string, CommentExtractor> = {
    'javascript': cFamilyExtractor,
    'typescript': cFamilyExtractor,
    'c': cFamilyExtractor,
    'c++': cFamilyExtractor,
} as const;

/**
 * Attempts to extract comment text given a document and a position.
 *
 * @returns String of the text, cleaned hopefully.
 */
export function extractCommentText(
    doc: TextDocument,
    startPos: Position,
): string | null {
    const lang = doc.languageId;
    if (lang in extractors) {
        return extractors[lang](doc, startPos);
    }
    return null;
}
