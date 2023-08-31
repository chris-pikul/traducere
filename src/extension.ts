import { languages, type ExtensionContext, commands, workspace } from 'vscode';
import { setContext } from './lib/state';
import { getConfigValue } from './lib/config';
import { hoverProvider } from './hover';
import { commandReplace } from './replace';
import { handleOpenDocument, handleSaveDocument } from './document';
import { debug, setupLogging } from './logging';

export function activate(context: ExtensionContext) {
    setupLogging();
    setContext(context);

    // Why do it live, when we can extract and cache?
    context.subscriptions.push(
        workspace.onDidOpenTextDocument(handleOpenDocument),
    );
    // Get all the currently opened documents
    workspace.textDocuments.forEach(handleOpenDocument);

    // Watch for saves
    context.subscriptions.push(
        workspace.onDidSaveTextDocument(handleSaveDocument),
    );

    context.subscriptions.push(
        commands.registerCommand(
            'traducere.translateAndReplace',
            commandReplace,
        ),
    );

    if (getConfigValue<boolean>('enableTooltip')) {
        debug('Registering hover provider for Traducere');

        context.subscriptions.push(
            languages.registerHoverProvider(
                { scheme: '*' },
                { provideHover: hoverProvider },
            ),
        );
    }
}

export function deactivate() {}
