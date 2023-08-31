import { type ExtensionContext } from 'vscode';
import { setContext } from './lib/state';
import commands from './commands';
import { type Command, registerCommand } from './lib/commands';

export function activate(context: ExtensionContext) {
	setContext(context);
	commands.forEach((cmd: Command) => registerCommand(context, cmd));
}

export function deactivate() {}
