export interface ToBytes {
    toBytes(): Uint8Array;
}

export interface Packet extends ToBytes {
    packetId(): PacketId;
}

export enum PacketId {
    Sync = 1,
    Movement = 2,
}
