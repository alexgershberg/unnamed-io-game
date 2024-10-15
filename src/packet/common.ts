export interface ToBytes {
    to_bytes(): Uint8Array;
}

export enum PacketType {
    Movement = 2,
}

export interface Packet extends ToBytes {
    packet_type: PacketType;
}
