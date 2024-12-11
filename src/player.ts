import { Position } from "./position";
import { camera, own_id } from "./index";
import { debug_textA, debugA, debugB, debugC, debugD } from "./debug";

export class Velocity {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}

export class Player {
    color = `#000000`;
    id: number = -1;
    position: Position = new Position();
    velocity = new Velocity();

    constructor() {}

    render(extrapolation: number): void {
        let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");
        let x_offset = this.velocity.x * extrapolation;
        let y_offset = this.velocity.y * extrapolation;
        let x = this.position.x - camera.x;
        let y = this.position.y - camera.y;
        // let x = this.position.x;
        // let y = this.position.y;

        let extrapolated_x = x + x_offset;
        let extrapolated_y = -1 * (y + y_offset);

        if (this.id === own_id) {
            // Don't extrapolate self
            extrapolated_x = x;
            extrapolated_y = -1 * y;
        }

        debugC(`extr: x: ${extrapolated_x.toFixed(4)}`);
        debugD(`extr: y: ${extrapolated_y.toFixed(4)}`);

        let radius = 25;
        let ctx = canvas.getContext("2d")!;
        let center_x = extrapolated_x + canvas.width / 2;
        let center_y = extrapolated_y + canvas.height / 2;
        ctx.beginPath();
        ctx.arc(center_x, center_y, radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#FF0000";
        ctx.stroke();
        ctx.closePath();

        if (own_id === this.id) {
            this.color = "#0099FF";
        }
        text(
            center_x,
            center_y - 50,
            `${this.velocity.x} | ${this.velocity.y}`,
        );
        text(
            center_x,
            center_y - 100,
            `${this.position.x} | ${this.position.y}`,
        );
    }
}

function text(x: number, y: number, txt: string) {
    let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");
    let ctx = canvas.getContext("2d")!;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";
    ctx.fillText(txt, x, y);
}
