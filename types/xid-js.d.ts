declare module "xid-js" {
    export interface XID {
        toString(): string;
        timestamp: number;
        machine: Uint8Array;
        pid: number;
        counter: number;
    }

    export function next(): string;
    export function fromString(str: string): XID;
    export function get(): XID;
}
