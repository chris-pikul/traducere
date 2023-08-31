/**
 * Provides utilities for showing and presenting information to the user
 */
import * as vscode from 'vscode';

/**
 * Shortcut for showing an error message on screen.
 *
 * @param message Message to desplay
 * @param items Additional message items, these are usually buttons
 */
export function showError(message: string, ...items: string[]): void {
    vscode.window.showErrorMessage(message, ...items);
}