import { Packet, PacketId } from "./common";
import { Id } from "./id";
import { Position } from "../position";
import { SyncPacket } from "./sync";
import { Velocity } from "../entities/player";

// export class AllPacket implements Packet {
//     // all: Array<SyncPacket>
//
//
//     packetId(): PacketId {
//         return PacketId.All;
//     }
//
//     toBytes(): Uint8Array {
//         return new Uint8Array([]);
//     }
//
//     static fromBytes(bytes: Uint8Array): AllPacket {
//         let id = Id.fromBytes(bytes.slice(0, 2));
//         let position = Position.fromBytes(bytes.slice(2, 10));
//         let velocity = Velocity.fromBytes(bytes.slice(10, 18));
//
//         // return new AllPacket(id, position, velocity);
//         return undefined;
//     }
//
// }
