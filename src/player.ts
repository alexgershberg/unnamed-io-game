import { Position } from "./position";
import { debugA, debugB, debugC, debugD } from "./debug";
import { reset_last_tick } from "./index";

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
}

export class Player {
    websocket: WebSocket;
    color = `#000000`;
    position: Position = new Position();
    velocity = new Velocity();
    keyboardDirection = new KeyboardDirection();

    constructor() {
        let address = "ws://192.168.0.169:10001";
        let websocket = new WebSocket(address);
        websocket.binaryType = "arraybuffer";
        websocket.onopen = () => {
            console.log("Connected");
        };

        websocket.onmessage = async (event) => {
            let blob = event.data;
            console.log(`blob: ${blob}`);
            let json = JSON.parse(blob);
            let player = json[0];

            this.position = player.position;
            this.velocity = player.velocity;
            this.color = `#00FF00`;

            reset_last_tick();
        };

        websocket.onclose = () => {
            console.log("Disconnected");
        };

        this.websocket = websocket;

        window.addEventListener("keydown", this.keyDownHandler.bind(this));
        window.addEventListener("keyup", this.keyUpHandler.bind(this));
    }

    sendInput() {
        console.log("sending input");
        this.websocket.send(JSON.stringify(this.keyboardDirection));
    }

    render(extrapolation: number): void {
        let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");
        let x = this.position.x;
        let y = this.position.y;

        let extrapolated_x =
            ((x + this.velocity.x * extrapolation) / canvas.width) * 2;
        let extrapolated_y =
            ((-1 * (y + this.velocity.y * extrapolation)) / canvas.height) * 2;

        // let extrapolated_x = x / canvas.width;
        // let extrapolated_y = (-1 * y) / canvas.height;

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

        this.color = "#000000";
    }

    keyDownHandler(event: KeyboardEvent) {
        if (event.repeat) {
            return;
        }

        switch (event.key) {
            case "O":
                // toggleFullscreen();
                return;

            case "W":
            case "w":
                this.keyboardDirection.up = true;
                break;

            case "A":
            case "a":
                this.keyboardDirection.left = true;
                break;

            case "D":
            case "d":
                this.keyboardDirection.right = true;
                break;

            case "S":
            case "s":
                this.keyboardDirection.down = true;
                break;
        }

        this.sendInput();
    }

    keyUpHandler(event: KeyboardEvent) {
        if (event.repeat) {
            return;
        }

        switch (event.key) {
            case "W":
            case "w":
                this.keyboardDirection.up = false;
                break;

            case "A":
            case "a":
                this.keyboardDirection.left = false;
                break;

            case "D":
            case "d":
                this.keyboardDirection.right = false;
                break;

            case "S":
            case "s":
                this.keyboardDirection.down = false;
                break;
        }

        this.sendInput();
    }
}
