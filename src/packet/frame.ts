import { Packet, PacketId, ToBytes } from "./common";
import { MovementPacket } from "./movement";
import { SyncPacket } from "./sync";

export class Frame implements ToBytes {
    packet: Packet;

    constructor(packet: Packet) {
        this.packet = packet;
    }

    toBytes(): Uint8Array {
        let packet = this.packet.toBytes();
        let packetId = this.packet.packetId();

        return new Uint8Array([packetId, ...packet]);
    }

    static fromBytes(bytes: Uint8Array): Frame {
        let packetId = bytes[0] as PacketId;

        let packet;
        if (packetId == PacketId.Movement) {
            packet = MovementPacket.fromBytes(bytes.slice(1));
        } else {
            packet = SyncPacket.fromBytes(bytes.slice(1));
        }

        return new Frame(packet);
    }
}
