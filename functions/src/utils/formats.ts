import { Timestamp } from "firebase-admin/firestore";

/**
 * Converts ISO Date String or Date object to Firestore Timestamp.
 *
 * @param {string|Date} date Date in ISO String.
 * @return {Timestamp} Firestore Timestamp field value.
 */
export function timestampFromISODateString(date: string | Date): Timestamp {
    return Timestamp.fromDate(new Date(date));
}

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
