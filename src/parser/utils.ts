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
        .filter((line) => line.length > 0 && line !== '\n' && line !== '\r\n')
        .join('\n');
}
