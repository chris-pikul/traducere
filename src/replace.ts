import {
    ProgressLocation,
    Selection,
    TextEditor,
    TextEditorEdit,
    window,
} from 'vscode';
import { showError, showWarning } from './lib/display';
import { useBackendService } from './backend';
import { error } from './logging';

type TranslationResult = {
    selection: Selection;
    text: string;
    replacement: string;
};

export async function commandReplace() {
    const editor = window.activeTextEditor;
    if (!editor) {
        error('no active editor exists');
        return;
    }

    if (editor.selections.length === 0) {
        showWarning('No text has been selected for translation');
        return;
    }

    const translations = await window.withProgress(
        {
            location: ProgressLocation.Window,
        },
        () =>
            Promise.allSettled(
                editor.selections.map<Promise<TranslationResult>>(
                    (selection: Selection) =>
                        new Promise<TranslationResult>((resolve, reject) => {
                            const text = editor.document.getText(selection);
                            if (text.length > 1) {
                                useBackendService(text)
                                    .then((replacement) =>
                                        resolve({
                                            selection,
                                            text,
                                            replacement,
                                        }),
                                    )
                                    .catch((err) => reject(err));
                            } else {
                                resolve({
                                    selection,
                                    text,
                                    replacement: text,
                                });
                            }
                        }),
                ),
            ),
    );

    const badResults = [];

    const results = await editor.edit((edit) =>
        translations.forEach((trans) => {
            if (trans.status === 'fulfilled') {
                const { selection, replacement } = trans.value;

                edit.replace(selection, replacement);
            } else {
                badResults.push(trans.reason);
            }
        }),
    );

    if (!results) {
        error('Editor edit-builder returned false');
        showError(
            'For some unknown reason, VSCode would not let us translate your selections',
        );
    } else if (badResults.length > 0) {
        showWarning(
            `We could not update some of your selections due to failures in the backend. It could be network related.`,
        );
    }
}
