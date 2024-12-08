export class Position {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    static fromBytes(bytes: Uint8Array): Position {
        let x_data = new DataView(bytes.slice(0, 4).buffer);
        let x = x_data.getFloat32(0, false);

        let y_data = new DataView(bytes.slice(4, 8).buffer);
        let y = y_data.getFloat32(0, false);

        return { x, y };
    }
}
