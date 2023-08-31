/**
 * Provides helpers and setup for extension logging
 */

import { LogOutputChannel, window } from 'vscode';

let channel: LogOutputChannel;

export function setupLogging() {
    channel = window.createOutputChannel('Traducere', {
        log: true,
    }) as LogOutputChannel;

    channel.appendLine(`Starting Traducere at ${new Date().toISOString()}`);
}

export function trace(msg: string, ...args: unknown[]): void {
    if (channel) {
        channel.trace.apply(null, arguments as any);
    } else {
        console.info.apply(null, arguments as any);
    }
}

export function debug(msg: string, ...args: unknown[]): void {
    if (channel) {
        channel.debug.apply(null, arguments as any);
    } else {
        console.info.apply(null, arguments as any);
    }
}

export function info(msg: string, ...args: unknown[]): void {
    if (channel) {
        channel.info.apply(null, arguments as any);
    } else {
        console.log.apply(null, arguments as any);
    }
}

export function warn(msg: string, ...args: unknown[]): void {
    if (channel) {
        channel.warn.apply(null, arguments as any);
    } else {
        console.warn.apply(null, arguments as any);
    }
}

export function error(msg: string, ...args: unknown[]): void {
    if (channel) {
        channel.error.apply(null, arguments as any);
    } else {
        console.error.apply(null, arguments as any);
    }
}
