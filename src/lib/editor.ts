/**
 * Provides utilities for interacting with editors and their text selections
 */
import { Selection, Position, window } from 'vscode';
import { showError } from './display';
import type { OutputFunction } from './commands';

/**
 * Utility to calculate a new selection based on the new source text length.
 *
 * @param selection Current selection
 * @param source New text being inserted
 * @returns New selection with correct length
 */
export function getEndSelection(
    selection: Selection,
    source: string,
): Selection {
    const pos = new Position(
        selection.start.line,
        selection.start.character + source.length,
    );
    return new Selection(pos, pos);
}

/**
 * Inserts text into the current active editor, at all cursors.
 *
 * NOTE: This will insert the same text at each cursor position.
 *
 * @param source New text to be inserted
 */
export function insert(source: string): void {
    const editor = window.activeTextEditor;
    if (!editor) return showError('No active text editor is available');

    const selections: Selection[] = [];
    editor
        .edit((builder) => {
            editor.selections.forEach((selection) => {
                builder.replace(selection, source);
                selections.push(getEndSelection(selection, source));
            });
        })
        .then(() => {
            editor.selections = selections;
        });
}

/**
 * Inserts text into the current active editor, at all cursors.
 *
 * NOTE: This will call the provided generator for each cursor position.
 *
 * @param func Function that returns new source text
 */
export function insertWithGenerator(
    func: OutputFunction,
    ...args: (string | undefined)[]
): void {
    const editor = window.activeTextEditor;
    if (!editor) return showError('No active text editor is available');

    const selections: Selection[] = [];
    editor
        .edit((builder) => {
            editor.selections.forEach((selection) => {
                const text = func(...args);
                builder.replace(selection, text);
                selections.push(getEndSelection(selection, text));
            });
        })
        .then(() => {
            editor.selections = selections;
        });
}
