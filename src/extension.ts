import { languages, type ExtensionContext, commands, Disposable } from 'vscode';
import { setContext } from './lib/state';
import { getConfigValue } from './lib/config';
import { hoverProvider } from './hover';
import { commandReplace } from './replace';

let cmdReplace: Disposable;

export function activate(context: ExtensionContext) {
    setContext(context);

    cmdReplace = commands.registerCommand(
        'traducere.translateAndReplace',
        commandReplace,
    );

    if (getConfigValue<boolean>('enableTooltip')) {
        console.log('Registering hover provider for Traducere');

        languages.registerHoverProvider(
            { scheme: '*' },
            { provideHover: hoverProvider },
        );
    }
}

export function deactivate() {
    if (cmdReplace) {
        cmdReplace.dispose();
    }
}
