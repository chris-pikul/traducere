/**
 * Provides utilities for showing and presenting information to the user
 */
import { window } from 'vscode';

/**
 * Shortcut for showing an error message on screen.
 *
 * @param message Message to desplay
 * @param items Additional message items, these are usually buttons
 */
export function showError(message: string, ...items: string[]): void {
    window.showErrorMessage(message, ...items);
}