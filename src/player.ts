import { Element } from "./element";
import { Position } from "./position";
import { debugA, debugB, debugC, debugD } from "./debug";
import { Id } from "./packet/id";
import { MovementPacket } from "./packet/movement";
import { Frame } from "./packet/frame";
import { SyncPacket } from "./packet/sync";

class KeyboardDirection {
    up = false;
    left = false;
    right = false;
    down = false;
}

export class Velocity {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    static fromBytes(bytes: Uint8Array): Velocity {
        let x_data = new DataView(bytes.slice(0, 4).buffer)
        let x = x_data.getFloat32(0, false);

        let y_data = new DataView(bytes.slice(4, 8).buffer)
        let y = y_data.getFloat32(0, false);

        return { x, y };
    }
}

export class Player implements Element {
    id: Id;
    websocket: WebSocket;
    color = `#000000`;
    position: Position = new Position();
    velocity = new Velocity();

    keyboardDirection: KeyboardDirection = new KeyboardDirection();

    constructor(id: Id) {
        this.id = id;
        let address = "ws://192.168.0.169:10001";
        let websocket = new WebSocket(address);
        websocket.binaryType = "arraybuffer";
        websocket.onopen = () => {
            console.log("Connected");
            // this.open = true;
        };

        websocket.onmessage = async (event) => {
            let blob = event.data;

            let bytes = new Uint8Array(blob);
            let frame = Frame.fromBytes(bytes);

            if (frame.packet instanceof SyncPacket) {
                let sync_packet = frame.packet;

                this.position = sync_packet.position;
                this.velocity = sync_packet.velocity;
                console.log("we good!");
            }

            this.tick();
        };

        websocket.onclose = () => {
            console.log("Disconnected");
            // this.open = false;
        };

        this.websocket = websocket;
    }

    sendInput() {
        let frame = new Frame(new MovementPacket(this.keyboardDirection));
        console.log("sending input");
        this.websocket.send(frame.toBytes());
    }

    render(extrapolation: number): void {
        let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");
        let x = this.position.x;
        let y = this.position.y;

        // let extrapolated_x =
        //     ((x + this.velocity.x * extrapolation) / canvas.width) * 2;
        // let extrapolated_y =
        //     ((-1 * (y + this.velocity.y * extrapolation)) / canvas.height) * 2;

        let extrapolated_x = x / canvas.width;
        let extrapolated_y = (-1 * y) / canvas.height;

        debugC(`extr: x: ${extrapolated_x.toFixed(2)}`);
        debugD(`extr: y: ${extrapolated_y.toFixed(2)}`);

        let radius = 25;
        let ctx = canvas.getContext("2d")!;
        ctx.beginPath();
        ctx.arc(
            canvas.width * extrapolated_x + canvas.width / 2,
            canvas.height * extrapolated_y + canvas.height / 2,
            radius,
            0,
            Math.PI * 2,
            false,
        );
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#FF0000";
        ctx.stroke();
    }

    tick() {
        this.color = `#00FF00`;
        let { x, y } = this.position;
        debugA(`position: ${x} | ${y}`);
    }
}

