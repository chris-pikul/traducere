import type { Range, TextDocument } from 'vscode';

export const blockTypes = {
    string: 'string',
    comment: 'comment',
} as const;
export type BlockType = (typeof blockTypes)[keyof typeof blockTypes];

export type Block = {
    type: BlockType;
    range: Range;
    originalText: string;
    cleanText: string;
};

export type ParseResults = Block[];

export type Parser = (doc: TextDocument) => ParseResults;
