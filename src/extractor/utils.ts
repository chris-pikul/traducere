export function removeStrings(text: string, charMap = '\'"`'): string {
    let results: string = '';
    let strMarker: string | null = null;
    let strStart = 0;
    let ignoreNext = false;

    // Going to walk it the old fashioned way
    for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i);
        if (char === '\\') {
            ignoreNext = true;
        } else if (ignoreNext) {
            ignoreNext = false;
        } else if (charMap.includes(char)) {
            if (strMarker) {
                // String is ending
                strMarker = null;
                strStart = i + 1;
            } else {
                // String is starting
                strMarker = char;
                results += text.substring(strStart, i);
            }
        }
    }

    // Check for overhang
    if (strMarker) {
        // It didn't close write, so the whole thing is valid
        results += text.substring(strStart);
    }

    return results;
}
