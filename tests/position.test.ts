import { expect, test } from "bun:test";
import { Position } from "../src/position";

test("Position.fromBytes()", () => {
    let bytes = new Uint8Array([69, 29, 12, 205, 195, 225, 153, 154]);

    let position = Position.fromBytes(bytes);
    expect(position.x).toEqual(2512.800048828125);
    expect(position.y).toEqual(-451.20001220703125);
});
