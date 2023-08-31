import { languages, type ExtensionContext } from 'vscode';
import { setContext } from './lib/state';
import commands from './commands';
import { type Command, registerCommand } from './lib/commands';
import { getConfigValue } from './lib/config';
import { hoverProvider } from './hover';

export function activate(context: ExtensionContext) {
    setContext(context);

    commands.forEach((cmd: Command) => registerCommand(context, cmd));

    if (getConfigValue<boolean>('enableTooltip')) {
        console.log('Registering hover provider for Traducere');

        languages.registerHoverProvider(
            { scheme: '*' },
            { provideHover: hoverProvider },
        );
    }
}

export function deactivate() {}
