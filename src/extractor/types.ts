import { Position, TextDocument } from 'vscode';

/**
 * Type declaration for a function that can extract comment text
 */
export type CommentExtractor = (
    doc: TextDocument,
    startPos: Position,
) => string | null;
