/**
 * Generate XID - globally unique, URL-safe, sortable identifier
 */
export function generateXID(): string {
    // Use require() for better compatibility with xid-js
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const XID = require("xid-js");
    return XID.next();
}

export const generateId = generateXID;

export function isValidXID(id: string): boolean {
    if (!id || typeof id !== "string") return false;
    const xidRegex = /^[0-9a-hjkmnp-tv-z]{20}$/;
    return xidRegex.test(id);
}
