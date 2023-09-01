import { createHash } from 'crypto';

/**
 * Removes any initial spacing and preceding * characters from a block comment.
 *
 * @param text
 * @returns
 */
export function cleanBlockComment(text: string): string {
    return text
        .split('\n')
        .map((line) => {
            let check = line.trim();
            if (check.charAt(0) === '*') {
                check = check.substring(1).trim();
            }

            return check.trim();
        })
        .join('\n');
}

/**
 * Creates an MD5 checksum hash of the given text.
 *
 * Uses node crypto.
 * @param text Text to hash
 * @returns MD5 hexidecimal checksum
 */
export function hash(text: string): string {
    return createHash('md5').update(text).digest('hex');
}
