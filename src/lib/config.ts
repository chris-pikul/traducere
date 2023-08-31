/**
 * Provides utilities for extension settings
 */
import { workspace } from "vscode";

/**
 * Get a configuration value using the given setting key.
 * Searches globally within the workspace.
 *
 * @param key Workspace setting key
 * @returns Value at that key
 */
export function getGlobalConfigValue<T = unknown>(key: string): T {
    const lastDot = key.lastIndexOf('.');

    const section = key.substring(0, lastDot);
    const prop = key.substring(lastDot + 1);

    return workspace.getConfiguration(section).get(prop) as T;
}

/**
 * Get a configuration value within the Traducere settings using the
 * given sub-key. This will prefix the key for you.
 *
 * @see {@link getGlobalConfigValue} for the real implementation
 * @param key Setting key within Traducere
 * @returns Value at that key
 */
export function getConfigValue<T = unknown>(key: string): T {
    return getGlobalConfigValue<T>(`traducere.${key}`);
}
