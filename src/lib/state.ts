/**
 * Provides a "state" mechanism for the extension in order to pass information
 * between commands.
 * 
 * This is basically just a "singleton" type pattern
 */
import { ExtensionContext } from 'vscode';

let context: ExtensionContext | null = null;

export function setContext(ctx: ExtensionContext): void {
    context = ctx;
}

export function getContext(): ExtensionContext | null {
    return context;
}
