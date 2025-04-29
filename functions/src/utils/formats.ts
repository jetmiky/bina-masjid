/**
 * Checks if a value is a valid JSON.
 *
 * @param {string} value Value to be checked as JSON.
 * @return {boolean}
 */
export function isValidJSON(value: string): boolean {
    try {
        JSON.parse(value);
        return true;
    } catch {
        return false;
    }
}
