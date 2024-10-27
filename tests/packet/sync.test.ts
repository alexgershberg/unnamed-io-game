import { expect, test } from "bun:test";
import { SyncPacket } from "../../src/packet/sync";
import { Id } from "../../src/packet/id";
import { Position } from "../../src/position";
import { Velocity } from "../../src/player";

test("SyncPacket.fromBytes()", () => {
    let bytes = new Uint8Array([
        0, 11, 69, 29, 12, 205, 195, 225, 153, 154, 65, 32, 0, 0, 192, 160, 0,
        0,
    ]);
    let sync_packet = SyncPacket.fromBytes(bytes);
    expect(sync_packet.id).toEqual(new Id(11));
    expect(sync_packet.position).toEqual(new Position(2512.800048828125, -451.20001220703125));
    expect(sync_packet.velocity).toEqual(new Velocity(10.0, -5.0));
});
