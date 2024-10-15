import assert from "node:assert";
import { ToBytes } from "./common";

export class Id implements ToBytes {
    private readonly inner: number;

    constructor(id: number) {
        assert(id < 65535, "Id must be less than u16:MAX");
        this.inner = id;
    }

    to_bytes(): Uint8Array {
        let byte0 = (this.inner >> 8) & 0xff;
        let byte1 = this.inner & 0xff;

        return new Uint8Array([byte0, byte1]);
    }
}
