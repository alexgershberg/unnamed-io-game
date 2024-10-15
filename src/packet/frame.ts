import { Id } from "./id";
import { Packet, ToBytes } from "./common";

export class Frame implements ToBytes {
    id: Id;
    packet: Packet;

    constructor(id: Id, packet: Packet) {
        this.id = id;
        this.packet = packet;
    }

    to_bytes(): Uint8Array {
        let id = this.id.to_bytes();
        let packet = this.packet.to_bytes();
        return new Uint8Array([...id, ...packet]);
    }
}
