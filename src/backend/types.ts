/**
 * Declares the types a backend uses.
 */

/**
 * Enumeration of the available service backends
 */
export const services = {
    loopback: 'Loopback',
    google: 'Google',
    microsoft: 'Microsoft',
    deepl: 'DeepL',
} as const;

/**
 * Enumeration value for an available service backend
 */
export type Service = (typeof services)[keyof typeof services];

/**
 * A function which performs translation services for us, taking an incoming
 * block of text, and promising to return the translated results.
 */
export type Backend = ((
    text: string,
    targetLanguage: string,
) => Promise<string>) & {
    service: Service;
};
