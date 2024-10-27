// import assert from "node:assert";
import { ToBytes } from "./common";

export class Id implements ToBytes {
    private readonly inner: number;

    constructor(id: number) {
        // assert(id < 65535, "Id must be less than u16:MAX");
        this.inner = id;
    }

    toBytes(): Uint8Array {
        let byte0 = (this.inner >> 8) & 0xff;
        let byte1 = this.inner & 0xff;

        return new Uint8Array([byte0, byte1]);
    }

    static fromBytes(bytes: Uint8Array): Id {
        let byte0 = bytes[0];
        let byte1 = bytes[1];

        let id = (byte0 << 8) | byte1;
        return new Id(id);
    }
}
