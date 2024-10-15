import { Packet, PacketType } from "./common";

export class MovementPacket implements Packet {
    packet_type = PacketType.Movement;
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

    to_bytes(): Uint8Array {
        let { up, down, left, right } = this.movement_matrix;

        let up_flag = up ? 0b1000 : 0;
        let down_flag = down ? 0b0100 : 0;
        let left_flag = left ? 0b0010 : 0;
        let right_flag = right ? 0b0001 : 0;
        let flags = (up_flag | down_flag | left_flag | right_flag) & 0b1111;

        return new Uint8Array([this.packet_type, flags]);
    }
}
