import { Packet, PacketId } from "./common";
import { Id } from "./id";
import { Position } from "../position";
import { Velocity } from "../player";

export class SyncPacket implements Packet {
    id = new Id(0);
    position = new Position();
    velocity = new Velocity();

    constructor(id: Id, position: Position, velocity: Velocity) {
        this.id = id;
        this.position = position;
        this.velocity = velocity;
    }

    packetId(): PacketId {
        return PacketId.Sync;
    }

    toBytes(): Uint8Array {
        return new Uint8Array();
    }

    static fromBytes(bytes: Uint8Array): SyncPacket {
        console.log(`SyncPacket::fromBytes() | all: ${bytes.toString()}`);
        let id = Id.fromBytes(bytes.slice(0, 2));
        console.log(
            `SyncPacket::fromBytes() |  id: ${bytes.slice(0, 2).toString()}`,
        );
        let position = Position.fromBytes(bytes.slice(2, 10));
        console.log(
            `SyncPacket::fromBytes() |  pos: ${bytes.slice(2, 10).toString()}`,
        );
        let velocity = Velocity.fromBytes(bytes.slice(10, 18));
        console.log(
            `SyncPacket::fromBytes() |  vel: ${bytes.slice(10, 18).toString()}`,
        );

        return new SyncPacket(id, position, velocity);
    }
}
