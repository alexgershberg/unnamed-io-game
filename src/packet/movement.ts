import { Packet, PacketId } from "./common";

export class MovementPacket implements Packet {
    movement_matrix: {
        up: boolean;
        down: boolean;
        left: boolean;
        right: boolean;
    };

    constructor(movement_matrix: {
        up: boolean;
        down: boolean;
        left: boolean;
        right: boolean;
    }) {
        this.movement_matrix = movement_matrix;
    }

    toBytes(): Uint8Array {
        let { up, down, left, right } = this.movement_matrix;

        let up_flag = up ? 0b1000 : 0;
        let down_flag = down ? 0b0100 : 0;
        let left_flag = left ? 0b0010 : 0;
        let right_flag = right ? 0b0001 : 0;
        let flags = (up_flag | down_flag | left_flag | right_flag) & 0b1111;

        return new Uint8Array([flags]);
    }

    packetId(): PacketId {
        return PacketId.Movement;
    }

    static fromBytes(bytes: Uint8Array): MovementPacket {
        let flags = bytes[0];
        let up = (flags & 0b1000) !== 0;
        let down = (flags & 0b0100) !== 0;
        let left = (flags & 0b0010) !== 0;
        let right = (flags & 0b0001) !== 0;
        let movement_matrix = { up, down, left, right };

        return new MovementPacket(movement_matrix);
    }
}
